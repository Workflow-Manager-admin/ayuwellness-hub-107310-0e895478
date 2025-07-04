import React, { useState } from "react";
import RemedyCard from "./RemedyCard";
import RemedyFilter from "./RemedyFilter";
import VideoList from "./VideoList";
import RemedyDetails from "./RemedyDetails";

// Sample remedy data
const sampleRemedies = [
  {
    id: 1,
    title: "Tulsi Ginger Tea",
    description: "Boosts immunity and alleviates cold symptoms.",
    category: "Cold & Immunity",
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    title: "Sandalwood Face Pack",
    description: "Helps soothe acne and skin irritation.",
    category: "Skin",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    title: "Triphala",
    description: "Aids digestion and detoxification.",
    category: "Digestion",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
  },
];

const categories = ["All", "Cold & Immunity", "Skin", "Digestion"];

const youtubeRemedyKeywords = [
  "Ayurvedic remedies",
  "Ayurveda home remedies",
  "herbal wellness Ayurveda"
];
  
// PUBLIC_INTERFACE
function Remedies() {
  // Add state for details view
  const [selectedCat, setSelectedCat] = useState("All");
  const [viewRemedy, setViewRemedy] = useState(null);
  const remediesToShow = selectedCat === "All"
    ? sampleRemedies
    : sampleRemedies.filter(r => r.category === selectedCat);

  if (viewRemedy) {
    return <RemedyDetails remedy={viewRemedy} onBack={() => setViewRemedy(null)} />;
  }

  return (
    <section className="ayu-container">
      <h2>Browse Remedies</h2>
      <RemedyFilter categories={categories} current={selectedCat} onChange={setSelectedCat} />
      <div className="remedy-list">
        {remediesToShow.map(remedy => (
          // Clicking a remedy opens details with nutrition info
          <div
            key={remedy.id}
            style={{cursor: "pointer"}}
            onClick={() => setViewRemedy(remedy)}
            tabIndex={0}
            role="button"
            aria-label={`View remedy details for ${remedy.title}`}
            onKeyPress={e => { if (e.key === "Enter" || e.key === " ") setViewRemedy(remedy); }}
          >
            <RemedyCard remedy={remedy} />
          </div>
        ))}
      </div>
      <div style={{marginTop: 40}}>
        <VideoList
          keywords={youtubeRemedyKeywords}
          useEmbed={true}
          maxResults={3}
        />
      </div>
    </section>
  );
}

export default Remedies;
