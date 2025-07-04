import React, { useState, useEffect } from "react";
import HerbDetail from "./HerbDetail";
import herbsData from "../assets/herbs.json";

// PUBLIC_INTERFACE
/**
 * HerbExplorer
 * Page to browse/search the herbalism database, display Ayurveda info for each herb.
 */
function HerbExplorer() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [herbs, setHerbs] = useState([]);

  useEffect(() => {
    // Load herbs from local JSON
    setHerbs(herbsData || []);
  }, []);

  // Filter herbs by name, benefit, Ayurveda use (any substring match)
  const filteredHerbs = herbs.filter(h => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [
      h.name,
      h.latin_name,
      ...(h.synonyms || []),
      ...(h.uses_ayurveda || []),
      ...(h.benefits || [])
    ].join(" ").toLowerCase().includes(q);
  });

  if (selected) {
    return <HerbDetail herb={selected} onBack={() => setSelected(null)} />;
  }
  return (
    <section className="ayu-container" style={{maxWidth:980}}>
      <h2>🌱 Herb Explorer</h2>
      <div className="ayu-form" style={{marginBottom:18,marginTop:5,flexDirection:"row",alignItems:"center",gap:14}}>
        <input
          type="text"
          placeholder="Search for herb, property or Ayurvedic use"
          value={search}
          style={{
            flex:1,
            padding:"8px 13px",
            borderRadius:10,
            border:"1.1px solid #bfd8b8",
            background:"#f9fff7",
            fontSize:"1em"
          }}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="ayu-btn ayu-btn-secondary" style={{margin:0}} onClick={()=>setSearch("")} disabled={!search}>Clear</button>
      </div>
      <div style={{margin:"9px 0 25px 0",fontSize:"1.12em",color:"#468b43"}}>
        Browse the Ayurvedic herbalism database. Click any herb to view details on benefits and uses.
      </div>
      <div className="remedy-list" style={{flexWrap:"wrap",gap:22}}>
        {filteredHerbs.length === 0 ? (
          <div style={{marginTop:40, color:"#998955", fontSize:"1.1em"}}>No herbs matched your search.</div>
        ) : filteredHerbs.map(h => (
          <div
            key={h.id}
            className="ayu-remedy-card"
            tabIndex={0}
            style={{
              cursor: "pointer",
              background: "#f7fff6",
              maxWidth: 295,
              minWidth: 200,
              marginBottom: 13
            }}
            onClick={() => setSelected(h)}
            aria-label={`View details of ${h.name}`}
            onKeyPress={(e) => { if (e.key === "Enter" || e.key === " ") setSelected(h);}}
          >
            <div className="remedy-info">
              <h4 style={{marginBottom:3}}>{h.name}</h4>
              <div className="remedy-cat" style={{marginBottom:6,color:"#65803d",fontWeight:500}}>{h.latin_name}</div>
              <div className="remedy-desc" style={{marginBottom:9}}>
                <b>Ayurvedic Uses:</b>
                <span style={{marginLeft:6,color:"#5b6e30",fontWeight:400, fontSize:"0.99em"}}>
                  {(h.uses_ayurveda || []).slice(0,2).join(", ")}
                </span>
              </div>
              <div className="remedy-desc" style={{fontSize:"0.985em",color:"#566949"}}>{(h.benefits||[])[0]}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HerbExplorer;
