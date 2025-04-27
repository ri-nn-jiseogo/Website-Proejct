// src/components/learning/index.jsx
import React from "react"
import { Link } from "react-router-dom"
import "./learning.css"

const lessons = [
  { id: "lesson1", title: "Lesson 1", desc: "Primitive Types" },
  { id: "lesson2", title: "Lesson 2", desc: "Boolean Expressions and if Statements" },
  { id: "lesson3", title: "Lesson 3", desc: "Iteration" },
  { id: "lesson4", title: "Lesson 4", desc: "Array" },
  { id: "lesson5", title: "Lesson 5", desc: "ArrayList" },
  { id: "lesson6", title: "Lesson 6", desc: "2D Array" },
  { id: "lesson7", title: "Lesson 7", desc: "Recursion" },
]

export default function Learning() {
  return (
    <div className="learning">
      <div className="TextBox">
        <div className="flex-container">
          <h1 className="missions">Missions</h1>
        </div>
        <p className="stage-desc">
          In the game, you are allowed to participate in up to 15 missions at a time.<br/>
          If you wish to join more missions, you must wait for a cooldown period before you can continue.
        </p>
      </div>
      <div className="chapter-container">
        {lessons.map(({ id, title, desc }) => (
          <div className="Chapter" key={id}>
            <Link to={`/user/learning/${id}`} className="chapter-link">
              <h1 className="chapter-title">{title}</h1>
              <div className="chapter-desc">
                <p>{desc}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
