import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";

export default function ViewPaste() {
  const { id } = useParams();
  const API = process.env.REACT_APP_API_URL;

  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/api/pastes/${id}`)
      .then((res) => {
        setContent(res.data.content);
      })
      .catch((err) => {
        setError(
          err.response?.data?.error || "Paste not available"
        );
      });
  }, [id, API]);

  return (
    <div className="container">
      <h2>View Paste</h2>

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <pre className="pasteBox">{content}</pre>
      )}
    </div>
  );
}
