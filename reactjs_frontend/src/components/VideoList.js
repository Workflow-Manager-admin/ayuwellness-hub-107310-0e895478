import React, { useState, useEffect } from "react";

// PUBLIC_INTERFACE
/**
 * VideoList fetches and displays a list of YouTube videos for Ayurveda topics.
 * - Prompts for YouTube API key if not set.
 * - Fetches videos by provided keywords (first match wins, all if showMultiple).
 * - Displays video embeds or thumbnails, with titles and descriptions.
 *
 * Props:
 *   - keywords: array of search terms (string)
 *   - maxResults: number of results per query (default: 4)
 *   - useEmbed: bool, if true show embeds, else show thumbnails (default: true)
 *   - showMultiple: bool, if true run all keywords and flatten results, else first with result (default: false)
 */
function VideoList({ keywords, maxResults = 4, useEmbed = true, showMultiple = false }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("yt_api_key") || "");
  const [promptApiKey, setPromptApiKey] = useState(!localStorage.getItem("yt_api_key"));
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle API Key prompt
  useEffect(() => {
    if (!apiKey) setPromptApiKey(true);
    else setPromptApiKey(false);
  }, [apiKey]);

  // Fetch videos when apiKey and keywords change
  useEffect(() => {
    if (!apiKey || !keywords || keywords.length === 0) return;
    setLoading(true);
    setError("");
    setVideos([]);

    const fetchForKeyword = async (kw) => {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(kw)}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`YouTube API error (${resp.status}): ${resp.statusText}`);
      const json = await resp.json();
      if (json.error) throw new Error(json.error.message || "YouTube API error");
      return (json.items || []).map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        desc: item.snippet.description,
        thumb: item.snippet.thumbnails.medium.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));
    };

    const performFetch = async () => {
      try {
        let vidList = [];
        if (showMultiple) {
          // Fetch for every keyword (flattened)
          for (let kw of keywords) {
            const vids = await fetchForKeyword(kw);
            vidList = vidList.concat(vids);
          }
        } else {
          // Find first keyword with result
          for (let kw of keywords) {
            const vids = await fetchForKeyword(kw);
            if (vids.length) {
              vidList = vids;
              break;
            }
          }
        }
        setVideos(vidList);
      } catch (e) {
        setError("Failed to load YouTube videos: " + (e.message || "Unknown error"));
      }
      setLoading(false);
    };

    performFetch();
    // eslint-disable-next-line
  }, [apiKey, keywords, maxResults, showMultiple]);

  // Input field for API Key
  function handleApiKeySubmit(e) {
    e.preventDefault();
    if (apiKey) {
      localStorage.setItem("yt_api_key", apiKey);
      setPromptApiKey(false);
    }
  }

  if (promptApiKey) {
    return (
      <div className="ayu-container" style={{ background: "#fffc", maxWidth: 475, borderRadius: 14, padding: 22, margin: "34px auto" }}>
        <h3>🎥 Enter YouTube API Key</h3>
        <p>
          To display Ayurveda video content, please provide your <a href="https://console.developers.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">YouTube Data API v3 key</a>.<br/>
          (API key is stored locally and never sent anywhere else)
        </p>
        <form onSubmit={handleApiKeySubmit} style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            placeholder="Paste your YouTube API key here"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            required
            style={{ flex: 1, borderRadius: 8, padding: 8, border: "1.3px solid #bdd", fontSize: "1em" }}
            autoFocus
          />
          <button type="submit" className="ayu-btn ayu-btn-primary">Save</button>
        </form>
        <div style={{fontSize: "0.95em", color: "#7c715a", marginTop: 10}}>
          <b>Note:</b> Free API keys have quota. Videos only load if a valid key is provided.
        </div>
      </div>
    );
  }

  return (
    <section style={{ marginTop: 30, marginBottom: 28 }}>
      <h3>Related Ayurvedic Wellness Videos</h3>
      {loading && <div>Loading videos...</div>}
      {error && (
        <div style={{ color: "#a94442", marginTop: 10, background: "#fff5f5", borderRadius: 8, padding: "9px 14px" }}>
          {error}
        </div>
      )}
      {!loading && videos && videos.length > 0 && (
        <div className="ayu-video-list" style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
          {videos.map(video => (
            <div key={video.id} style={{ maxWidth: 320, flex: "1 1 250px" }}>
              {useEmbed ? (
                <div className="video-responsive" style={{ marginBottom: 10 }}>
                  <iframe
                    width="300"
                    height="168"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <a href={video.url} target="_blank" rel="noopener noreferrer" style={{display:"block"}}>
                  <img src={video.thumb} alt={video.title} style={{ width: "100%", borderRadius: 10, boxShadow: "0 2px 12px -3px #bfd8b8" }} />
                </a>
              )}
              <div style={{ fontWeight: 700, color: "#585315", fontSize: "1.05em", margin: "8px 0 4px 0" }}>
                {video.title}
              </div>
              <div style={{ color: "#786854", fontSize: "0.98em", maxHeight: 60, overflow: "hidden" }}>
                {video.desc}
              </div>
              {!useEmbed && (
                <a href={video.url} className="ayu-btn ayu-btn-primary" style={{marginTop: 6,display:"inline-block",fontSize:"0.96em"}} target="_blank" rel="noopener noreferrer">
                  ◉ Watch Video
                </a>
              )}
            </div>
          ))}
        </div>
      )}
      {!loading && videos && videos.length === 0 && !error && (
        <div style={{color: "#8e8d78", marginTop: 13, fontSize: "1em"}}>No Ayurveda-related videos found for these keywords.</div>
      )}
    </section>
  );
}

export default VideoList;
