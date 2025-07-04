import React from "react";
import ArticleCard from "./ArticleCard";

// Sample articles
const sampleArticles = [
  {
    id: 1,
    title: "5 Everyday Ayurvedic Skin Rituals",
    snippet: "Glowing skin is possible with Ayurveda. Discover morning abhyanga, gentle herbal cleansers, and mindful routines.",
    image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=400&q=80",
    url: "#"
  },
  {
    id: 2,
    title: "Seasonal Detox: Why and How?",
    snippet: "Reset your system the Ayurvedic way—gentle herbal teas, light fasting, and practical daily habits.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80",
    url: "#"
  },
];

const youtubeId = "F-hRLzqUvto"; // Ayurveda skin care video

// PUBLIC_INTERFACE
function Articles() {
  return (
    <section className="ayu-container">
      <h2>Ayurveda Articles & Wellness Reads</h2>
      <div className="article-list">
        {sampleArticles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      <div className="ayu-container" style={{marginTop: 32}}>
        <h3>🎬 Watch: Ayurvedic Skin Care Tips</h3>
        <div className="video-responsive">
          <iframe
            width="360"
            height="203"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="Ayurveda Skin Care"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

export default Articles;
