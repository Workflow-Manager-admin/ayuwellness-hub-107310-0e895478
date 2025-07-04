import React, { useState } from "react";

// Quiz questions
const questions = [
  {
    id: 1,
    text: "What best describes your body build?",
    options: [
      { text: "Slender, finds it hard to gain weight", type: "Vata" },
      { text: "Medium, moderately built", type: "Pitta" },
      { text: "Sturdy, gains weight easily", type: "Kapha" },
    ]
  },
  {
    id: 2,
    text: "What is your skin type?",
    options: [
      { text: "Dry and rough", type: "Vata" },
      { text: "Soft and warm, tends to flush", type: "Pitta" },
      { text: "Smooth, moist, pale", type: "Kapha" },
    ]
  },
  {
    id: 3,
    text: "Your energy level is:",
    options: [
      { text: "Variable, often bursts of energy", type: "Vata" },
      { text: "Steady and intense", type: "Pitta" },
      { text: "Consistent, slow but enduring", type: "Kapha" },
    ]
  }
];

const doshaDescriptions = {
  Vata: "Vata (Air & Space): Creative, lively, quick, but prone to anxiety and dryness. Stay warm and grounded.",
  Pitta: "Pitta (Fire & Water): Driven, sharp, ambitious, with sensitive skin/digestion. Stay cool, avoid overheating.",
  Kapha: "Kapha (Earth & Water): Calm, steady, compassionate, tends to congestion/weight gain. Get active and eat light."
};

// PUBLIC_INTERFACE
function DoshaQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleOption = idx => {
    setAnswers([...answers, questions[step].options[idx].type]);
    setStep(step + 1);
  };

  // Scoring logic
  function result() {
    if (answers.length !== questions.length) return null;
    const scores = { Vata: 0, Pitta: 0, Kapha: 0 };
    answers.forEach(a => scores[a]++);
    const dominant = Object.keys(scores).reduce((a, b) => scores[a] >= scores[b] ? a : b);
    return dominant;
  }

  const finalResult = result();

  return (
    <section className="ayu-container">
      <h2>Dosha Personality Quiz</h2>
      {finalResult ? (
        <div className="ayu-quiz-result">
          <h3>Your dominant Dosha: <span className={`dosha ${finalResult.toLowerCase()}`}>{finalResult}</span></h3>
          <p>{doshaDescriptions[finalResult]}</p>
          <div className="ayu-suggestions">
            <b>Herbal Suggestions:</b>
            <ul>
              {finalResult === "Vata" && <li>Warm teas (ginger, cinnamon), sesame oil massage, cooked meals</li>}
              {finalResult === "Pitta" && <li>Coconut water, aloe vera, cooling foods, meditation</li>}
              {finalResult === "Kapha" && <li>Light soups, turmeric, regular exercise, avoid dairy</li>}
            </ul>
          </div>
          <button className="ayu-btn" onClick={() => { setStep(0); setAnswers([]); }}>Retake Quiz</button>
        </div>
      ) : (
        <div className="ayu-quiz-step">
          <h3>Step {step + 1} of {questions.length}</h3>
          <p className="ayu-quiz-q">{questions[step].text}</p>
          <div className="ayu-quiz-options">
            {questions[step].options.map((opt, i) => (
              <button className="ayu-btn ayu-btn-secondary" key={i} onClick={() => handleOption(i)}>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default DoshaQuiz;
