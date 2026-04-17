import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import "../styles/pages/EditPost.css";

const BASE_URL = import.meta.env.VITE_API_URL;

function EditPost() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) throw new Error("Failed to load post");

        setTitle(data.title);
        setContent(data.content);
        setStatus(data.status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, status }),
      });

      if (!response.ok) throw new Error("Failed to update post");

      alert("Post updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <h2>Loading post...</h2>;
  if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

  return (
    <div className="edit-post-container">
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="edit-post-form">
        <div className="form-grid">
          {/* Row 1: Title */}
          <label className="form-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
          />

          {/* Row 2: Content */}
          <label className="form-label">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            rows="16"
            required
          />

          {/* Row 3: Status + Buttons */}
          <label className="form-label">Status</label>
          <div className="status-and-actions">
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} className="submit-btn">
                {saving ? "Saving Changes..." : "Update Post"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditPost;
