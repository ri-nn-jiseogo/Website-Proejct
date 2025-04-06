import subprocess # 이 파일말고, 다른 파일 접근하고.
import os # 디렉토리 추적할 때.

# 모든 java 파일
java_files =[file for file in os.listdir('.') if file.endswith('.java')]

for java_file in java_files:
    class_name = java_file.replace(".java", "")
    
    try:
        subprocess.run(["javac", java_file], check = True)
        print("Compile Success")
        result = subprocess.run(["java", class_name], capture_output=True, text=True)

        print(result.stdout)

    except:
        print("Error")