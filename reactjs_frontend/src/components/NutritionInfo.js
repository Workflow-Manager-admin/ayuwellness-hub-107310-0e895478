import React, { useState, useEffect } from "react";

// PUBLIC_INTERFACE
/**
 * NutritionInfo component
 * Displays nutrition facts for given ingredient(s) using Nutritionix API.
 *
 * Props:
 *   - ingredients: string[] (main ingredient names; e.g., ["turmeric", "ginger"])
 *
 * If user has not provided Nutritionix API credentials, prompts for them and stores in localStorage.
 * Shows calories, macros (protein, carbs, fat), and key micronutrients.
 */
function NutritionInfo({ ingredients = [] }) {
  const [appId] = useState(() => localStorage.getItem("nutritionix_app_id") || "");
  const [appKey] = useState(() => localStorage.getItem("nutritionix_app_key") || "");
  const [nutritionData, setNutritionData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const showApiInfo = !appId || !appKey;

  useEffect(() => {
    let cancelled = false;

    async function fetchAllIngredients() {
      setLoading(true);
      setError("");
      setNutritionData({});
      let results = {};
      let fetched = 0;

      const fetchForIngredient = async (ing) => {
        const apiUrl = "https://trackapi.nutritionix.com/v2/natural/nutrients";
        try {
          const resp = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-app-id": appId,
              "x-app-key": appKey
            },
            body: JSON.stringify({ query: ing, timezone: "US/Eastern" })
          });
          if (!resp.ok) throw new Error(`API error: ${resp.statusText}`);
          const json = await resp.json();
          if (json.errors) throw new Error(json.errors[0]);
          results[ing] = (json.foods && json.foods[0]) ? json.foods[0] : null;
        } catch (e) {
          results[ing] = { error: e.message || "Failed to fetch" };
        }
        fetched++;
        if (fetched === ingredients.length && !cancelled) {
          setNutritionData({ ...results });
          setLoading(false);
        }
      };

      for (const ing of ingredients) {
        await fetchForIngredient(ing);
      }
    }

    if (!showApiInfo && ingredients.length) {
      fetchAllIngredients();
    }

    return () => { cancelled = true; };
  }, [appId, appKey, ingredients, showApiInfo]);

  if (!ingredients.length) {
    return null;
  }

  if (showApiInfo) {
    return (
      <div className="ayu-container" style={{ background: "#eef6ed", maxWidth: 440, borderRadius: 14, padding: 22, margin: "28px auto", color: "#8a7b44" }}>
        <h3>🥄 Nutrition Info (API required)</h3>
        <div style={{marginTop:16,marginBottom:10}}>
          <span style={{ fontSize: "1.09em", color: "#ad633c" }}><b>Feature available with API key</b></span>
        </div>
        <div>
          To view nutrition facts for remedies, add your Nutritionix App ID and Key in browser <b>localStorage</b>.<br />
          <span style={{ fontSize: "0.98em" }}>(This app will not prompt for these. No credentials are stored by the app.)</span>
        </div>
        <div style={{ fontSize: "0.92em", color: "#7a6842", marginTop: 10 }}>
          Learn more: <a href="https://developer.nutritionix.com/" target="_blank" rel="noopener noreferrer">Nutritionix Developer Portal</a>
        </div>
      </div>
    );
  }

  return (
    <div className="ayu-container" style={{ background: "#fcfef5", border: "1.1px solid #bfd8b8", borderRadius: 14, marginTop: 30, padding: 18 }}>
      <h3 style={{ color: "#689f38" }}>Nutrition Info</h3>
      {loading && <div>Looking up nutritional info...</div>}
      {error && <div style={{ color: "#a94442", background: "#fff6f6", borderRadius: 7, padding: "7px 10px" }}>{error}</div>}
      {!loading && Object.keys(nutritionData).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {ingredients.map(ing => {
            const data = nutritionData[ing];
            if (!data) return (
              <div key={ing} style={{ minWidth: 210, maxWidth: 260, padding: 10, background: "#f4fbed", borderRadius: 10, color: "#b26d3d" }}>No data found for <b>{ing}</b></div>
            );
            if (data.error) return (
              <div key={ing} style={{ minWidth: 210, maxWidth: 260, padding: 10, background: "#f4fbed", borderRadius: 10, color: "#a94442" }}>Error for <b>{ing}</b>: {data.error}</div>
            );
            // Show nutrition summary
            return (
              <div key={ing} style={{ minWidth: 210, maxWidth: 265, padding: 12, background: "#fff", borderRadius: 11, border: "1px solid #d6e4d6", boxShadow: "0 1.5px 8px -4px #b2ddbe" }}>
                <h4 style={{ marginTop: 0, marginBottom: 10 }}>{data.food_name ? data.food_name[0].toUpperCase() + data.food_name.slice(1) : ing}</h4>
                <div><b>Calories:</b> {data.nf_calories} kcal</div>
                <div><b>Protein:</b> {data.nf_protein} g</div>
                <div><b>Carbs:</b> {data.nf_total_carbohydrate} g</div>
                <div><b>Fat:</b> {data.nf_total_fat} g</div>
                {typeof data.nf_sugars !== "undefined" && <div><b>Sugars:</b> {data.nf_sugars} g</div>}
                {typeof data.nf_dietary_fiber !== "undefined" && <div><b>Fiber:</b> {data.nf_dietary_fiber} g</div>}
                {/* Show common micronutrients if available */}
                {data.full_nutrients && (
                  <div style={{fontSize:"0.98em",marginTop:9}}>
                    <MicronutrientList nutrients={data.full_nutrients} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper: Nutritionix nutrients map (ids to micronutrient names/units)
const NUTRIENT_MAP = {
  301: { name: "Calcium", unit: "mg" },
  303: { name: "Iron", unit: "mg" },
  401: { name: "Vitamin C", unit: "mg" },
  404: { name: "Vitamin B1 (Thiamin)", unit: "mg" },
  405: { name: "Vitamin B2 (Riboflavin)", unit: "mg" },
  406: { name: "Vitamin B3 (Niacin)", unit: "mg" },
  418: { name: "Vitamin B12", unit: "µg" },
  320: { name: "Vitamin A", unit: "IU" },
  430: { name: "Vitamin K", unit: "µg" },
  323: { name: "Vitamin E", unit: "mg" },
  307: { name: "Sodium", unit: "mg" },
  306: { name: "Potassium", unit: "mg" },
  605: { name: "Trans Fat", unit: "g" }
};
function MicronutrientList({ nutrients }) {
  const shown = Object.entries(NUTRIENT_MAP).map(([id, meta]) => {
    const nutr = nutrients.find(n => String(n.attr_id) === id);
    if (!nutr || nutr.value === 0) return null;
    return (
      <div key={id}>
        <b>{meta.name}:</b> {nutr.value} {meta.unit}
      </div>
    );
  }).filter(Boolean);
  if (!shown.length) return null;
  return (
    <div>
      <b>Micronutrients:</b>
      {shown}
    </div>
  );
}

export default NutritionInfo;
