import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import AppLayout from "./AppLayout";
import MessagePage from "./components/MessagePage";
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import ForgetPassword from "./pages/ForgetPassword";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";
import Auth from "./pages/auth/Auth";


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<Login />} />
          <Route path="auth" element={<Auth />} />
          <Route path="forget-password" element={<ForgetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path=":userId" element={<MessagePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
