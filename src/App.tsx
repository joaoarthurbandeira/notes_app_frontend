import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<HomePage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
