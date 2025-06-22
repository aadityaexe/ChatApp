import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";

const App = () => {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="bg-[url('/src/assets/bgImage.svg')] bg-contain">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={
            <div>{authUser ? <ProfilePage /> : <Navigate to="/login" />}</div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
