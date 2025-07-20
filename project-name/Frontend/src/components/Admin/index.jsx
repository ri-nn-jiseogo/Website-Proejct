import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import * as XLSX from 'xlsx'
import '../../App.css'
import './admin.css'
const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

const lessonTopics = [
  'Primitive_types',
  'If_statements',
  'Iteration',
  'Array',
  'Arraylist',
  '2D_array',
  'Recursion',
  'Random'
]

export default function Admin() {
  const [lessonStatus, setLessonStatus] = useState(Array(8).fill(false))
  const [questionStats, setQuestionStats] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState('')
  const [difficulty, setDifficulty] = useState('')

  useEffect(() => {
    fetch(`${BASE}/api/lesson-status`)
      .then(res => res.json())
      .then(data => setLessonStatus([
        data.lesson1,
        data.lesson2,
        data.lesson3,
        data.lesson4,
        data.lesson5,
        data.lesson6,
        data.lesson7,
        data.lesson8
      ]))
      .catch(console.error)

    async function fetchStats() {
      try {
        const stats = await Promise.all(
          lessonTopics.map(async (topic, idx) => {
            const docRef = doc(db, 'Questions', topic)
            const snap = await getDoc(docRef)
            const docData = snap.exists() ? snap.data() : {}
            let easy = 0, moderate = 0, difficult = 0
            Object.values(docData).forEach(q => {
              const d = (q.Difficulty || '').toLowerCase()
              if (d === 'easy') easy++
              else if (d === 'moderate') moderate++
              else difficult++
            })
            const total = easy + moderate + difficult
            return { lesson: idx + 1, total, difficult, moderate, easy }
          })
        )
        setQuestionStats(stats)
      } catch (e) {
        console.error(e)
      }
    }
    fetchStats()
  }, [])

  const toggleLesson = idx => {
    const updated = [...lessonStatus]
    updated[idx] = !updated[idx]
    setLessonStatus(updated)
  }

  const handleSave = async () => {
    const payload = lessonStatus.reduce((acc, st, i) => {
      acc[`lesson${i + 1}`] = st
      return acc
    }, {})
    try {
      const res = await fetch(`${BASE}/api/lesson-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statuses: payload })
      })
      if (res.ok) alert('complete save')
      else alert('failed save')
    } catch {
      alert('Network error')
    }
  }

  const exportQuestionSet = async () => {
    try {
      const snap = await getDocs(collection(db, 'Questions'))
      const rows = []
      snap.forEach(docSnap => {
        const topic = docSnap.id
        const data = docSnap.data()
        Object.entries(data).forEach(([qid, q]) => {
          rows.push({
            lesson: topic,
            questionId: qid,
            difficulty: q.Difficulty,
            question: q.Question,
            testCase1_input: q.testValue?.testCase1?.input || '',
            testCase1_output: q.testValue?.testCase1?.output || '',
            testCase2_input: q.testValue?.testCase2?.input || '',
            testCase2_output: q.testValue?.testCase2?.output || '',
            testCase3_input: q.testValue?.testCase3?.input || '',
            testCase3_output: q.testValue?.testCase3?.output || ''
          })
        })
      })
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Questions')
      XLSX.writeFile(wb, 'questions.xlsx')
    } catch (err) {
      console.error(err)
      alert('ERROR')
    }
  }

  const openModal = () => setShowModal(true)
  const closeModal = () => {
    setShowModal(false)
    setSelectedLesson('')
    setDifficulty('')
  }

  const confirmGenerate = async () => {
    try {
      const topicmap = {
        'Lesson 1': 'Primitive_types',
        'Lesson 2': 'If_statements',
        'Lesson 3': 'Iteration',
        'Lesson 4': 'Array',
        'Lesson 5': 'Arraylist',
        'Lesson 6': '2D_array',
        'Lesson 7': 'Recursion',
        'Lesson 8': 'Random'
      }
      const topicKey = topicmap[selectedLesson]
      const res = await fetch(`${BASE}/api/gpt-problem?lesson=${topicKey}&difficulty=${difficulty.toLowerCase()}`)
      if (res.ok) alert('Successfully generated questions')
      else alert('failed generate questions')
    } catch {
      alert('Network error')
    }
    closeModal()
  }

  return (
    <div className="admin-page">
      <h1>ADMIN Setting</h1>
      <section className="status-management">
        <h2>Learning Missions Status Management</h2>
        <div className="toggle-container">
          <div className="toggle-column">
            {lessonStatus.slice(0, 4).map((st, i) => (
              <div key={i} className="toggle-item">
                <span className="lesson-label">Lesson {i + 1}</span>
                <label className="switch">
                  <input type="checkbox" checked={st} onChange={() => toggleLesson(i)} />
                  <span className="slider"></span>
                </label>
                <span className={`status ${st ? 'unlocked' : 'locked'}`}>
                  {st ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            ))}
          </div>
          <div className="toggle-column">
            {lessonStatus.slice(4).map((st, i) => {
              const idx = i + 4
              return (
                <div key={idx} className="toggle-item">
                  <span className="lesson-label">Lesson {idx + 1}</span>
                  <label className="switch">
                    <input type="checkbox" checked={st} onChange={() => toggleLesson(idx)} />
                    <span className="slider"></span>
                  </label>
                  <span className={`status ${st ? 'unlocked' : 'locked'}`}>
                    {st ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="btn-group" style={{ marginTop: '1rem' }}>
          <button className="admin-btn" onClick={handleSave}>Save</button>
        </div>
      </section>
      <hr className="divider" />
      <section className="question-management">
        <h2>Learning Missions Question Management</h2>
        <div className="btn-group">
          <button className="admin-btn" onClick={exportQuestionSet}>Question Set</button>
          <button className="admin-btn" onClick={openModal}>Generate</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Lesson</th>
              <th>Number of Total Questions</th>
              <th>Difficult</th>
              <th>Moderate</th>
              <th>Easy</th>
            </tr>
          </thead>
          <tbody>
            {questionStats.map(row => (
              <tr key={row.lesson}>
                <td>{row.lesson}</td>
                <td>{row.total}</td>
                <td>{row.difficult}</td>
                <td>{row.moderate}</td>
                <td>{row.easy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Question Add</h2>
            <div className="modal-body">
              <div className="form-row">
                <label>Lesson:</label>
                <select value={selectedLesson} onChange={e => setSelectedLesson(e.target.value)}>
                  <option value="" disabled>Select Lesson</option>
                  {lessonStatus.map((_, i) => (
                    <option key={i} value={`Lesson ${i + 1}`}>Lesson {i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Difficulty:</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                  <option value="" disabled>Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Difficult">Difficult</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-generate" onClick={confirmGenerate} disabled={!selectedLesson || !difficulty}>Generate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
