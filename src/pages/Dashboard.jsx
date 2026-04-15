import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) {
        console.log("No token found, skipping fetch");
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://odin-blog-api-backend.onrender.com/api/posts/my-posts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        console.log("Response Data:", data);

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <h2>Loading your posts...</h2>;
  if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <div>
          <button onClick={() => navigate("/posts/new")}>New Post</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {posts.length === 0 ? (
        <p>You don't have any posts yet. Create your first one!</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <span className={`status-badge ${post.status.toLowerCase()}`}>
                {post.status}
              </span>
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
