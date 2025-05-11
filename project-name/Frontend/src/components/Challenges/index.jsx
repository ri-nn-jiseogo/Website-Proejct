import React from 'react';
import { Link } from 'react-router-dom';
import './challenges.css';

function Challenges() {
  // ...
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