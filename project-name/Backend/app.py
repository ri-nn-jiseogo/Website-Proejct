# app.py

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import firebase_admin
from firebase_admin import credentials, firestore, auth
import json
import subprocess
from google.cloud.firestore import Increment

# Initialize Flask and enable CORS
app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise RuntimeError("Missing OPENAI_API_KEY")
client = openai.OpenAI(api_key=openai_api_key)

# Initialize Firebase Admin SDK
sa_info = {
    "type":                         os.getenv("FIREBASE_TYPE"),
    "project_id":                   os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id":               os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key":                  os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
    "client_email":                 os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id":                    os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri":                     os.getenv("FIREBASE_AUTH_URI"),
    "token_uri":                    os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url":  os.getenv("FIREBASE_AUTH_PROVIDER_CERT_URL"),
    "client_x509_cert_url":         os.getenv("FIREBASE_CLIENT_CERT_URL")
}

cred = credentials.Certificate(sa_info)
firebase_admin.initialize_app(cred)
db = firestore.client()


def load_exist_problems(topic):
    """
    Fetch existing question texts for the given topic
    to avoid generating duplicates.
    """
    try:
        print(f"[DEBUG] Loading existing problems for topic: {topic}")
        doc_ref = db.collection("Questions").document(topic.capitalize())
        doc = doc_ref.get()

        existing = []
        if doc.exists:
            for qid, qdata in doc.to_dict().items():
                text = qdata.get("Question")
                if text:
                    existing.append(text)
        print(f"[DEBUG] Found {len(existing)} existing problems.")
        return existing

    except Exception as e:
        print("[ERROR] load_exist_problems:", e)
        return []


@app.route("/api/gpt-problem", methods=["GET"])
def generate_gpt_problem():
    """
    Generate a new practice problem via GPT and store it in Firestore.
    """
    topic = request.args.get("lesson")
    difficulty = request.args.get("difficulty")
    if not topic or not difficulty:
        print("[ERROR] Missing topic or difficulty in request")
        return jsonify({"error": "Missing topic or difficulty"}), 400
    existing = load_exist_problems(topic)
    next_num = len(existing) + 1
    existing_str = "\n".join(f"- {q}" for q in existing) if existing else "None"

    messages = [
        {"role": "system", "content": "You are an APCS A practice problem maker for elementary school students."},
        {
            "role": "user",
            "content": f"""Previous questions (avoid repeating these):
            {existing_str}

            Use this JSON format (without code fences):
            {{
            "Q{next_num}": {{
                "Difficulty": "{difficulty}",
                "Question": "...",
                "title": "...",
                "testValue": {{
                "testCase1": {{"input": "...", "output": "..."}},
                "testCase2": {{"input": "...", "output": "..."}},
                "testCase3": {{"input": "...", "output": "..."}}
                }}
            }}
            }}

            Now generate 1 {difficulty} problem about '{topic}', different from the above. also title should be 1-2 words"""
        }
    ]

    try:
        print(f"[DEBUG] Sending GPT request for topic {topic}, question #{next_num}")
        resp = client.chat.completions.create(model="gpt-4o", messages=messages, max_tokens=512)
        content = resp.choices[0].message.content
        print("[DEBUG] GPT response received:")
        print(content)
        parsed = json.loads(content)
        db.collection("Questions").document(topic.capitalize()).set(parsed, merge=True)
        print("[DEBUG] New problem saved to Firestore.")
        return jsonify({"message": "Problem saved", "content": parsed})
    except Exception as e:
        print("[ERROR] generate_gpt_problem:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/gpt-challenge", methods=["GET"])
def generate_gpt_challenge():
    topic = request.args.get("lesson")
    username = request.args.get("username")
    if not topic or not username:
        return jsonify({"error": "Missing topic or username"}), 400
    
    print(topic)

    user_doc_ref = db.collection("Challenges").document(username)
    snap = user_doc_ref.get()
    existing = snap.to_dict() if snap.exists else {}
    next_num = len(existing) + 1
    existing_str = "\n".join(f"- {k}" for k in existing.keys()) if existing else "None"

    messages = [
        {"role": "system", "content": "You are an APCS A practice problem maker for elementary school students."},
        {
            "role": "user",
            "content": f"""Previous questions (avoid repeating these):
        {existing_str}

        Use this exact JSON format (no code fences, only double-quoted keys/values):
        {{
        "Q{next_num}": {{
            "Difficulty": "difficult",
            "Question": "...",
            "title": "...",
            "testValue": {{
            "testCase1": {{ "input": "...", "output": "..." }},
            "testCase2": {{ "input": "...", "output": "..." }},
            "testCase3": {{ "input": "...", "output": "..." }}
            }}
        }}
        }}

        Now generate 1 difficult problem about "{topic}". Title should be 1–2 words."""
                }
            ]

    try:
        resp = client.chat.completions.create(model="gpt-4o", messages=messages, max_tokens=512)
        content = resp.choices[0].message.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1].strip()
        parsed = json.loads(content)
        user_doc_ref.set(parsed, merge=True)
        return jsonify({"message": "Challenge saved", "content": parsed})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



def record_code(user_id, category, question_id, correct, code):
    """
    Record a user's latest submission result in Firestore (overwrite mode).
    """
    try:
        if not all([user_id, category, question_id]):
            return jsonify({"error": "Missing required fields"}), 500

        doc_id = f"{user_id}_{question_id}"
        doc_ref = db.collection("UserSolvedProblems").document(doc_id)
        doc_snapshot = doc_ref.get()

        if doc_snapshot.exists:
            existing = doc_snapshot.to_dict()
            if existing.get("correct") == "correct":
                return jsonify({"message": "Already marked correct. Skipped."}), 200
            
        db.collection("UserSolvedProblems").document(doc_id).set({
            "userId": user_id,
            "category": category,
            "questionId": question_id,
            "correct": correct,
            "code": code,
            "timestamp": firestore.SERVER_TIMESTAMP
        })

        return jsonify({"message": "Submission recorded"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/submit-code", methods=["POST"])
def submit_code():
    """
    Compile and run the submitted Java code against test cases
    loaded from Firestore, then return the results.
    """
    print("[DEBUG] /api/submit-code called")
    data = request.get_json()
    print("[DEBUG] Received payload:", data)

    user_code = data.get("code", "")
    user_id = data.get("userID")
    category = data.get("category")
    problem_id = data.get("problem_id")

    print("[DEBUG] Writing user code to Main.java")
    with open("Main.java", "w", encoding="utf-8") as f:
        f.write(user_code)

    print("[DEBUG] Compiling Main.java")
    compile_proc = subprocess.run(["javac", "Main.java"], capture_output=True, text=True)
    print("[DEBUG] Compiler return code:", compile_proc.returncode)
    if compile_proc.returncode != 0:
        print("[DEBUG] Compilation errors:", compile_proc.stderr)
        return jsonify({"result": "compile_error", "message": compile_proc.stderr}), 200

    print(f"[DEBUG] Loading test cases for {category}/{problem_id}")
    doc_ref = db.collection("Questions").document(category)
    doc_snap = doc_ref.get()
    test_cases = []
    if doc_snap.exists:
        problem_data = doc_snap.to_dict().get(problem_id, {})
        for tc_name, tc in problem_data.get("testValue", {}).items():
            inp = tc.get("input")
            inp_str = " ".join(map(str, inp)) if isinstance(inp, (list, tuple)) else str(inp)
            test_cases.append({"input": inp_str, "output": str(tc.get("output", ""))})
        print(f"[DEBUG] Retrieved {len(test_cases)} test cases.")
    else:
        print("[WARN] No Firestore doc found; using empty test case.")
        test_cases = [{"input": "", "output": ""}]

    all_passed = True
    details = []
    for idx, tc in enumerate(test_cases, start=1):
        print(f"[DEBUG] Running test case {idx}: input={tc['input']}, expected={tc['output']}")
        run_proc = subprocess.run(["java", "Main"], input=tc["input"], capture_output=True, text=True)
        if run_proc.returncode != 0:
            print(f"[DEBUG] Runtime error on test case {idx}:", run_proc.stderr)
            all_passed = False
            details.append({
                "testCase": idx,
                "result": "runtime_error",
                "expected": tc["output"],
                "received": run_proc.stderr
            })
            break

        received = run_proc.stdout.strip()
        print(f"[DEBUG] Test case {idx} output:", received)
        if received == tc["output"]:
            details.append({"testCase": idx, "result": "pass", "expected": tc["output"], "received": received})
        else:
            all_passed = False
            details.append({"testCase": idx, "result": "fail", "expected": tc["output"], "received": received})

    result_status = "Correct" if all_passed else "Incorrect"
    print(f"[DEBUG] Final status: {result_status}")

    record_code(user_id, category, problem_id, result_status, user_code)


    if result_status == "Correct":
        difficulty = problem_data.get("Difficulty", "").lower()

        try:
            user_ref = db.collection("users").document(user_id)
            user_ref.update({
                f"stats.{difficulty}": Increment(1)
            })
            print(f"[DEBUG] Incremented stats.{difficulty} for user {user_id}")
        except Exception as e:
            print(f"[ERROR] Failed to increment stats for user: {e}")

    return jsonify({"result": result_status, "details": details}), 200


@app.route("/api/skip-problem", methods=["POST"])
def skip_problem():
    data = request.json
    user_id     = data.get("userId")          
    lesson_id   = data.get("category")        
    question_id = data.get("questionId")     

    if not all([user_id, lesson_id, question_id]):
        return jsonify({"error": "Missing fields"}), 400

    try:
        doc_id = f"{user_id}_{question_id}"    
        firestore.client()\
            .collection("UserSolvedProblems")\
            .document(doc_id)\
            .set(
                {
                    "category":   lesson_id,
                    "code":       "",          
                    "correct":    "giveup",       
                    "questionId": question_id,
                    "timestamp":  firestore.SERVER_TIMESTAMP,
                    "userId":     user_id,
                },
                merge=True                  
            )

        return jsonify({"message": "Recorded skip"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/api/lesson-status", methods=["GET"])
def get_lesson_status():
    doc_ref = db.collection("Settings").document("LessonStatus")
    doc = doc_ref.get()
    if doc.exists:
        return jsonify(doc.to_dict()), 200
    else:
        return jsonify({}), 200

@app.route("/api/lesson-status", methods=["POST"])
def set_lesson_status():
    data = request.get_json()
    statuses = data.get("statuses", {})
    doc_ref = db.collection("Settings").document("LessonStatus")
    doc_ref.set(statuses, merge=True)
    return jsonify({"message": "저장 완료"}), 200



def count_problems_by_lesson(lesson: str) -> int:
    doc_snap = db.collection("Questions").document(lesson).get()
    data     = doc_snap.to_dict() or {}
    return len([k for k in data.keys() if k.startswith("Q")])

@app.route("/api/next-problem", methods=["POST"])
def get_next_problem():
    data     = request.get_json(force=True)
    user_id  = data.get("userID")
    category = data.get("category")
    if not user_id or not category:
        return jsonify({"error": "need UserID or category"}), 400

    lesson_doc = db.collection("Questions").document(category).get()
    if not lesson_doc.exists:
        return jsonify({"error": f"Lessons/{category} document load failed"}), 404
    questions_map = lesson_doc.to_dict() or {}

    qids = sorted(
        [k for k in questions_map.keys() if k.startswith("Q")],
        key=lambda s: int(s[1:])
    )
    print(f"[DEBUG] available QIDs → {qids}")

    solved_cursor = (
        db.collection("UserSolvedProblems")
          .where("userId",   "==", user_id)
          .where("category", "==", category)
          .stream()
    )
    solved_map = {
        doc.get("questionId"): (doc.get("correct") or "").lower()
        for doc in solved_cursor
    }
    print(f"[DEBUG] solved_map → {solved_map}")

    for qid in qids:
        status = solved_map.get(qid, "")
        print(f"[DEBUG] check {qid} status={status}")
        if status not in ("correct", "giveup"):
            print(f"[DEBUG] nextProblem → {qid}")
            return jsonify({
                "nextProblemId": qid,
                "problemData":   questions_map[qid]
            }), 200

    print("[DEBUG] all done")
    return jsonify({"message": "all problem has been solved"}), 200

from google.cloud.firestore import SERVER_TIMESTAMP
import subprocess

@app.route("/api/skip-challenge", methods=["POST"])
def skip_challenge():
    data = request.get_json()
    user_id = data.get("userId")
    question_id = data.get("questionId")
    if not all([user_id, question_id]):
        return jsonify({"error": "Missing userId or questionId"}), 400
    doc_id = f"{user_id}_{question_id}"
    db.collection("UserChallengeSubmissions") \
      .document(doc_id) \
      .set({
          "userId": user_id,
          "questionId": question_id,
          "code": "",
          "correct": "giveup",
          "timestamp": SERVER_TIMESTAMP
      }, merge=True)
    return jsonify({"message": "Challenge skip recorded"}), 200

@app.route("/api/submit-challenge", methods=["POST"])
def submit_challenge():
    data = request.get_json()
    user_id = data.get("userId")
    question_id = data.get("questionId")
    user_code = data.get("code", "")
    if not all([user_id, question_id, user_code is not None]):
        return jsonify({"error": "Missing userId, questionId or code"}), 400

    with open("Main.java", "w", encoding="utf-8") as f:
        f.write(user_code)

    compile_proc = subprocess.run(
        ["javac", "Main.java"],
        capture_output=True, text=True
    )
    if compile_proc.returncode != 0:
        return jsonify({
            "result": "compile_error",
            "message": compile_proc.stderr
        }), 200

    doc_ref = db.collection("Challenges").document(user_id)
    snap = doc_ref.get()
    test_cases = []
    if snap.exists:
        prob_data = snap.to_dict().get(question_id, {})
        for tc in prob_data.get("testValue", {}).values():
            inp = tc.get("input")
            inp_str = " ".join(map(str, inp)) if isinstance(inp, (list, tuple)) else str(inp)
            test_cases.append({
                "input": inp_str,
                "output": str(tc.get("output", ""))
            })
    else:
        test_cases = [{"input": "", "output": ""}]

    all_passed = True
    details = []
    for idx, tc in enumerate(test_cases, start=1):
        run_proc = subprocess.run(
            ["java", "Main"],
            input=tc["input"],
            capture_output=True, text=True
        )
        if run_proc.returncode != 0:
            all_passed = False
            details.append({
                "testCase": idx,
                "result": "runtime_error",
                "stderr": run_proc.stderr
            })
            break
        out = run_proc.stdout.strip()
        if out == tc["output"]:
            details.append({
                "testCase": idx,
                "result": "pass",
                "output": out
            })
        else:
            all_passed = False
            details.append({
                "testCase": idx,
                "result": "fail",
                "expected": tc["output"],
                "received": out
            })

    status = "Correct" if all_passed else "Incorrect"
    doc_id = f"{user_id}_{question_id}"
    db.collection("UserChallengeSubmissions") \
      .document(doc_id) \
      .set({
          "userId": user_id,
          "questionId": question_id,
          "code": user_code,
          "correct": status.lower(),
          "timestamp": SERVER_TIMESTAMP
      }, merge=True)

    return jsonify({"result": status, "details": details}), 200


@app.route("/api/get-problem", methods=["GET"])
def get_problem():
    lesson     = request.args.get("lesson") 
    problem_id = request.args.get("problem_id") 

    if not lesson or not problem_id:
        return jsonify({"error": "Missing lesson or problem_id"}), 400

    doc_ref = db.collection("Questions").document(lesson)
    doc_snap = doc_ref.get()

    if not doc_snap.exists:
        return jsonify({"error": f"Lesson '{lesson}' not found"}), 404

    problem_data = doc_snap.to_dict().get(problem_id)
    if not problem_data:
        return jsonify({"error": f"Problem '{problem_id}' not found in lesson '{lesson}'"}), 404

    return jsonify({problem_id: problem_data}), 200

@app.route("/api/get-challenge", methods=["GET"])
def get_challenge():
    user_id    = request.args.get("user_id")    
    problem_id = request.args.get("problem_id") 

    if not user_id or not problem_id:
        return jsonify({"error": "Missing user_id or problem_id"}), 400

    doc_ref = db.collection("Challenges").document(user_id)
    doc_snap = doc_ref.get()

    if not doc_snap.exists:
        return jsonify({"error": f"Challenges for user '{user_id}' not found"}), 404

    challenge_data = doc_snap.to_dict().get(problem_id)
    if not challenge_data:
        return jsonify({"error": f"Challenge problem '{problem_id}' not found for user '{user_id}'"}), 404

    return jsonify({problem_id: challenge_data}), 200

@app.route("/api/delete-account", methods=["POST"])
def delete_account():
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    try:
        db.collection("users").document(user_id).delete()

        solved_qs = db.collection("UserSolvedProblems") \
                      .where("userId", "==", user_id) \
                      .stream()
        for doc in solved_qs:
            db.collection("UserSolvedProblems").document(doc.id).delete()

        challenge_subs = db.collection("UserChallengeSubmissions") \
                           .where("userId", "==", user_id) \
                           .stream()
        for doc in challenge_subs:
            db.collection("UserChallengeSubmissions").document(doc.id).delete()

        try:
            auth.delete_user(user_id)
        except firebase_admin._auth_utils.UserNotFoundError:
            pass
        except Exception as e:
            return jsonify({"error": f"Failed to delete auth user: {str(e)}"}), 500

        return jsonify({"message": "Account and all related data deleted."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    app.run(host="0.0.0.0", port=port, debug=False)