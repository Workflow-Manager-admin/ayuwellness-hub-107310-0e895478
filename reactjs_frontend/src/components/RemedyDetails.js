import React from "react";
import NutritionInfo from "./NutritionInfo";

// Extend this lookup for mapping remedies to major herbal ingredients (for demo purposes)
const INGREDIENT_LOOKUP = {
  "Tulsi Ginger Tea": ["ginger", "tulsi"], // tulsi = holy basil
  "Sandalwood Face Pack": ["sandalwood"],
  "Triphala": ["triphala"],
  "Turmeric Honey Paste": ["turmeric", "honey"],
  "Aloe Vera Soothe": ["aloe vera"]
};

// PUBLIC_INTERFACE
/**
 * RemedyDetails component.
 * Shows details for an individual remedy with Nutrition Info section for main herbal ingredients.
 *
 * Props:
 *   - remedy: object { id, title, description, category, image }
 */
function RemedyDetails({ remedy, onBack }) {
  if (!remedy) return null;
  // Use the lookup, or basic fallback: parse by lowercased words
  const mainIngredients =
    INGREDIENT_LOOKUP[remedy.title] ||
    remedy.title
      .toLowerCase()
      .split(/[ &,+-]/)
      .filter(w => w.length > 2 && !["face", "pack", "paste", "tea", "boost", "soothe"].includes(w))
      .map(w => w.trim());

  return (
    <div className="ayu-container" style={{padding: "22px 14px", maxWidth: 510}}>
      <button className="ayu-btn ayu-btn-chip" style={{marginBottom: 10}} onClick={onBack}>&larr; Back to Remedies</button>
      <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
        <img src={remedy.image} alt={remedy.title} style={{width:220, borderRadius: 16, marginBottom: 16, boxShadow:"0 2px 11px -7px #b2ddbe"}} />
        <h2 style={{marginBottom:7}}>{remedy.title}</h2>
        <div className="remedy-cat" style={{marginBottom:7}}>{remedy.category}</div>
        <div className="remedy-desc" style={{marginBottom:23, color: "#274420"}}>{remedy.description}</div>
      </div>
      <NutritionInfo ingredients={mainIngredients} />
    </div>
  );
}

export default RemedyDetails;
