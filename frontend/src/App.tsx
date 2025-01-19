import { Routes, Route } from "react-router-dom";

//components
import CreatePost from "./components/CreatePost";
import Login from "./components/Login";
import PostList from "./components/PostList";
import Register from "./components/Register";
import { Layout } from "./components/Layout";
import { getCookie } from "./utils/cookies";
import EditPost from "./components/EditPost";

function App() {
  const token = getCookie("token");

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PostList />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route
            path="/create"
            element={token ? <CreatePost token={token} /> : <Login />}
          />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
