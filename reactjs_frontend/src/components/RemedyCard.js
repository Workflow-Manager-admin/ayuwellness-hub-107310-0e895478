import React from "react";

// PUBLIC_INTERFACE
function RemedyCard({ remedy }) {
  return (
    <div className="ayu-remedy-card">
      <img src={remedy.image} alt={remedy.title} className="remedy-img" />
      <div className="remedy-info">
        <h4>{remedy.title}</h4>
        <p className="remedy-cat">{remedy.category}</p>
        <p className="remedy-desc">{remedy.description}</p>
      </div>
    </div>
  );
}

export default RemedyCard;
