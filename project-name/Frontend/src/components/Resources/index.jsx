import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./resources.css";

const lessons = [
  { id: "lesson1", title: "Lesson 1", desc: "Primitive Types" },
  { id: "lesson2", title: "Lesson 2", desc: "Boolean Expressions" },
  { id: "lesson3", title: "Lesson 3", desc: "Iteration" },
  { id: "lesson4", title: "Lesson 4", desc: "Array" },
  { id: "lesson5", title: "Lesson 5", desc: "ArrayList" },
  { id: "lesson6", title: "Lesson 6", desc: "2D Array" },
  { id: "lesson7", title: "Lesson 7", desc: "Recursion" },
];
export default function Learning() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="learning">
      <div className="learning__text-box">
        <div className="learning__header">
          <h1 className="learning__title">Missions</h1>
        </div>

        <p className="learning__description">
          If you feel the need for further learning in any chapter, 
          <br />
          simply click the button for the desired chapter below to access additional online learning materials.
        </p>
      </div>

      <div className="resource-container">
        {lessons.map(({ id, title, desc }) => (
          <div className="Resource" key={id}>
            <Link to={``} className="chapter-link">
              <h1 className="resource-title">{title}</h1>
              <div className="resource-desc">
                <p>{desc}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
