import React from "react";

// PUBLIC_INTERFACE
function ArticleCard({ article }) {
  return (
    <a className="ayu-article-card" href={article.url || "#"} target="_blank" rel="noopener noreferrer">
      <img src={article.image} alt={article.title} className="article-img" />
      <div className="article-content">
        <h4>{article.title}</h4>
        <p className="article-snippet">{article.snippet}</p>
      </div>
    </a>
  );
}

export default ArticleCard;
