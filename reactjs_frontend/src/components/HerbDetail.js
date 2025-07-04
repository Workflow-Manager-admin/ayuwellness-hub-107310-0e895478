import React from "react";

// PUBLIC_INTERFACE
/**
 * HerbDetail
 * Displays detail for a selected herb: name, description, Ayurveda uses, benefits, etc.
 * Props:
 *   - herb: object (herb data)
 *   - onBack: function (handler for closing detail)
 */
function HerbDetail({ herb, onBack }) {
  if (!herb) return null;
  return (
    <div className="ayu-container" style={{maxWidth:540,padding:"28px 16px",margin:"18px auto"}}>
      <button className="ayu-btn ayu-btn-chip" style={{marginBottom: 16}} onClick={onBack}>&larr; Back to List</button>
      <h2 style={{marginTop:0,marginBottom:6}}>{herb.name} <span style={{color:"#88981b",fontWeight:400,fontSize:"1.08em"}}>({herb.latin_name})</span></h2>
      <div style={{color:"#58701b",marginBottom:14,fontSize:"1.08em"}}>{herb.synonyms && herb.synonyms.length
        ? <span><b>Synonyms:</b> {herb.synonyms.join(", ")}</span> : null}</div>
      <div style={{margin:"0 0 18px 0",color:"#355d2b",fontSize:"1.09em"}}>{herb.description}</div>
      <div style={{marginBottom:18}}>
        <b>Ayurvedic Uses:</b>
        <ul style={{margin:"7px 0 11px 0",paddingLeft:20}}>
          {(herb.uses_ayurveda || []).map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      </div>
      <div style={{marginBottom:18}}>
        <b>Health Benefits:</b>
        <ul style={{margin:"7px 0 11px 0",paddingLeft:20}}>
          {(herb.benefits || []).map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
      <div style={{marginBottom:9}}>
        <b>Dosha Balancing:</b>
        <span style={{marginLeft:9, color:"#795b00"}}>
          {(herb.dosha || []).join(", ") || "—"}
        </span>
      </div>
      <div style={{marginBottom:9}}>
        <b>Parts Used:</b>
        <span style={{marginLeft:9}}>{(herb.parts_used||[]).join(", ")||"—"}</span>
      </div>
      <div style={{marginBottom:9}}>
        <b>Main Actions:</b>
        <span style={{marginLeft:9}}>{(herb.actions||[]).join(", ")||"—"}</span>
      </div>
    </div>
  );
}

export default HerbDetail;
