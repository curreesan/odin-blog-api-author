import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
const BASE_URL = import.meta.env.VITE_LOCAL_API_URL;

function EditPost() {
  const { id } = useParams(); // Gets the post id from URL
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch the post when component loads
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/posts/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("edit post", data);

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
    <div className="new-post-container">
      <h1>Edit Post</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="15"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
          <button type="submit" disabled={saving}>
            {saving ? "Saving Changes..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;
