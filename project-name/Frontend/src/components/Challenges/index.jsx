import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import './challenges.css';

function Challenges() {
  // ...
  const [lessonStatus, setLessonStatus] = useState(Array(8).fill(false))
  const [questionStats, setQuestionStats] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedLesson1, setSelectedLesson1] = useState('')
  const [selectedLesson2, setSelectedLesson2] = useState('')
  const [selectedLesson3, setSelectedLesson3] = useState('')
  const [difficulty, setDifficulty] = useState('')

  setSelectedLesson('Lesson 1')

  const challengeGenerate = async () => {
    console.log(`Generate hard questions for ${selectedLesson}`)
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
      };
      const topicKey1 = topicmap[selectedLesson1];
      const topicKey2 = topicmap[selectedLesson2];
      const topicKey3 = topicmap[selectedLesson3];
      const res = await fetch(`http://localhost:5050/api/gpt-challenge?lesson1=${topicKey1}&lesson2=${topicKey2}&lesson3=${topicKey3}&difficulty=hard`);
      if (res.ok) alert('Successfully generated questions')
      else alert('failed generate questions')
    } catch {
      alert('Network error')
    }
    closeModal()
  }


  return (
    <div className="challenges">
      <div className="challenges__text-box">
        <div className="challenges__header">
          <div className="challenges-title">
            <h1 className="challenges__title">Challenges</h1>
          </div>

        </div>
        <p className="challenges__description">
          Once you have completed all the lessons, you can challenge yourself with a task that combines various lesson topics,
          <br />
          allowing you to earn more points by focusing on your weak areas.
        </p>
      </div>

      <div className='challenges-content'>
        <div className="challenges-container">
          <h1 className='challenges-graph-title'>My Weak Points</h1>
        </div>
        <div className='challenges-analysis'>
          <h1 className='challenges-analysis-title'>Challenge!</h1>
          <div classNamme='challenges-analysis-topic'>
            <h1 className='challenges-topic-analysis'>Topics you will encounter: </h1>
          </div>
        </div>
      </div>



    </div>
  )
}
export default Challenges;