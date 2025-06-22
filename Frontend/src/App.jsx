import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";

const App = () => {
  return (
    <div className="bg-[url('/src/assets/bgImage.svg')] bg-contain">
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <div>
              <LoginPage />
            </div>
          }
        />
        <Route
          path="/profile"
          element={
            <div>
              <ProfilePage />
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
