import { useState } from "react";
import axios from "axios";
import "./home.css";

export default function Home() {
  const API = process.env.REACT_APP_API_URL;

  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createPaste = async () => {
    setError("");
    setUrl("");

    if (!content.trim()) {
      setError("Paste content cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const body = {
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined
      };

      const res = await axios.post(`${API}/api/pastes`, body);

      setUrl(res.data.url);
      setContent("");
      setTtl("");
      setViews("");
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Pastebin Lite</h1>

      <textarea
        placeholder="Write your paste here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="row">
        <input
          type="number"
          placeholder="TTL seconds (optional)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Views (optional)"
          value={views}
          onChange={(e) => setViews(e.target.value)}
        />
      </div>

      <button onClick={createPaste} disabled={loading}>
        {loading ? "Creating..." : "Create Paste"}
      </button>

      {error && <p className="error">{error}</p>}

      {url && (
        <div className="result">
          <p>Share this link:</p>
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </div>
      )}
    </div>
  );
}
