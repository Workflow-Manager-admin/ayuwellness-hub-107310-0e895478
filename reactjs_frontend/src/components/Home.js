import React from "react";
import RemedyCard from "./RemedyCard";

// Sample featured remedies for home
const featuredRemedies = [
  {
    id: 1,
    title: "Turmeric Honey Paste",
    description: "Natural anti-inflammatory remedy for colds and sore throat.",
    category: "Cold & Immunity",
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    title: "Aloe Vera Soothe",
    description: "Soothes skin rashes and helps healing due to its cooling properties.",
    category: "Skin",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
  },
];

const youtubeId = "KECImWX2OzY"; // Sample Ayurveda intro video

// PUBLIC_INTERFACE
function Home() {
  return (
    <section className="home-section">
      <div className="hero ayu-bg-accent">
        <h1 className="home-title">Welcome to <span className="ayu-highlight">AyuCare</span></h1>
        <p className="home-subtitle">Your gateway to natural well-being, personal Ayurveda insights,<br/> and trusted home remedies.</p>
        <a href="/quiz" className="ayu-btn ayu-btn-large ayu-btn-primary">Take the Dosha Quiz →</a>
      </div>

      <div className="home-featured ayu-container">
        <h2>🌿 Featured Remedies</h2>
        <div className="remedy-list">
          {featuredRemedies.map(remedy => (
            <RemedyCard key={remedy.id} remedy={remedy} />
          ))}
        </div>
      </div>

      <div className="home-video ayu-container">
        <h2>🧘 Ayurvedic Wisdom: Watch & Learn</h2>
        <div className="video-responsive">
          <iframe
            width="360"
            height="203"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="Ayurveda Intro"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

export default Home;
