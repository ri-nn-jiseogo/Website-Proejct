import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./resources.css";

const lessons = [
  {link: "https://runestone.academy/ns/books/published/csawesome/Unit1-Getting-Started/toctree.html",id: "lesson1", title: "Lesson 1", desc: "Primitive Types" },
  {link: "https://runestone.academy/ns/books/published/csawesome/Unit3-If-Statements/toctree.html", id: "lesson2", title: "Lesson 2", desc: "Boolean Expressions" },
  {link: "https://runestone.academy/ns/books/published/csawesome/Unit4-Iteration/toctree.html", id: "lesson3", title: "Lesson 3", desc: "Iteration" },
  {link: "https://runestone.academy/ns/books/published/csawesome/Unit6-Arrays/toctree.html", id: "lesson4", title: "Lesson 4", desc: "Array" },
  {link: "https://runestone.academy/ns/books/published/csawesome/Unit7-ArrayList/toctree.html" ,id: "lesson5", title: "Lesson 5", desc: "ArrayList" },
  {link: "https://runestone.academy/ns/books/published/csawesome/Unit8-2DArray/toctree.html", id: "lesson6", title: "Lesson 6", desc: "2D Array" },
  {link:  "https://runestone.academy/ns/books/published/csawesome/Unit10-Recursion/toctree.html",id: "lesson7", title: "Lesson 7", desc: "Recursion" },
];

export default function Learning() {
  return (
    <div className="learning">
      <div className="learning__text-box">
        <h1 className="learning__title">Missions</h1>
        <p className="learning__description">
          If you feel the need for further learning in any chapter,
          <br />
          simply click the button for the desired chapter below to access additional online learning materials.
        </p>
      </div>

      <div className="resource-container">
        {lessons.map(({ link, id, title, desc }) => (
          <div className="Resource" key={id}>
            <a
              href={link}
              className="chapter-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h1 className="resource-title">{title}</h1>
              <div className="resource-desc">
                <p>{desc}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
