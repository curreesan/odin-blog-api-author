import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//Pages
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewPost from "./pages/NewPost.jsx";
import EditPost from "./pages/EditPost.jsx";

//Components
import Layout from "./components/Layout.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/posts/new" element={<NewPost />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  ); 
}

export default App;
