import React, { useState, useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * VideoList fetches and displays a list of YouTube videos for Ayurveda topics.
 * If no YouTube Data API key is available, renders an info message and disables video fetching.
 */
function VideoList({ keywords, maxResults = 4, useEmbed = true, showMultiple = false }) {
  const [apiKey] = useState(() => localStorage.getItem("yt_api_key") || "");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const youtubeDisabled = !apiKey || apiKey.length < 10;

  useEffect(() => {
    if (youtubeDisabled || !keywords || keywords.length === 0) return;
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
          for (let kw of keywords) {
            const vids = await fetchForKeyword(kw);
            vidList = vidList.concat(vids);
          }
        } else {
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

    if (!youtubeDisabled) performFetch();
    // eslint-disable-next-line
  }, [apiKey, keywords, maxResults, showMultiple, youtubeDisabled]);

  if (youtubeDisabled) {
    return (
      <div className="ayu-container" style={{ background: "#fffcf3", maxWidth: 475, borderRadius: 14, padding: 22, margin: "28px auto", color: "#994e27" }}>
        <h3>🎥 Ayurvedic Videos Unavailable</h3>
        <div style={{marginBottom:12}}>
          <span style={{ fontSize: "1.09em", color: "#ad633c" }}><b>Feature available with YouTube API key</b></span>
        </div>
        <div>
          To view YouTube Ayurveda videos, add your Data API v3 key in browser <b>localStorage</b>.<br />
          <span style={{ fontSize: "0.97em" }}>(This app never prompts for or stores keys.)</span>
        </div>
        <div style={{fontSize: "0.91em", color: "#7c715a", marginTop: 10}}>
          Learn more: <a href="https://console.developers.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Developers</a>
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
