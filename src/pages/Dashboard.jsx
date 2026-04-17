import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import "../styles/pages/Dashboard.css";

const BASE_URL = import.meta.env.VITE_LOCAL_API_URL;

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/posts/my-posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Server error: ${response.status}`);
        }

        const postsArray =
          data.posts && Array.isArray(data.posts) ? data.posts : [];
        setPosts(postsArray);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  // Toggle Status
  const handleToggleStatus = async (postId, currentStatus) => {
    setTogglingId(postId);

    const statusCycle = {
      DRAFT: "PUBLISHED",
      PUBLISHED: "ARCHIVED",
      ARCHIVED: "DRAFT",
    };

    const newStatus = statusCycle[currentStatus] || "DRAFT";

    try {
      const response = await fetch(`${BASE_URL}/api/posts/${postId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, status: newStatus } : post,
        ),
      );
    } catch (err) {
      alert("Error updating status: " + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  // Delete Post
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setDeletingId(postId);

    try {
      const response = await fetch(`${BASE_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete post");

      setPosts(posts.filter((post) => post.id !== postId));
      alert("Post deleted successfully!");
    } catch (err) {
      alert("Error deleting post: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <h2>Loading your posts...</h2>;
  if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

  return (
    <div className="dashboard">
      {posts.length === 0 ? (
        <p>You don't have any posts yet. Create your first one!</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>

              <p className="post-content">{post.content?.substring(0, 500)}</p>

              <div className="post-meta">
                <div className="meta-left">
                  <span className={`status-badge ${post.status.toLowerCase()}`}>
                    {post.status}
                  </span>
                  <span className="date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="post-actions">
                  <button onClick={() => navigate(`/posts/${post.id}/edit`)}>
                    Edit
                  </button>

                  <button
                    onClick={() => handleToggleStatus(post.id, post.status)}
                    disabled={togglingId === post.id}
                    className="toggle-status-btn"
                  >
                    {togglingId === post.id
                      ? "Updating..."
                      : `→ ${getNextStatus(post.status)}`}
                  </button>

                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="delete-btn"
                  >
                    {deletingId === post.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const getNextStatus = (current) => {
  if (current === "DRAFT") return "Publish";
  if (current === "PUBLISHED") return "Archive";
  if (current === "ARCHIVED") return "Draft";
  return "Change Status";
};

export default Dashboard;
