import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import CheckEmail from "./pages/CheckEmail";
import CheckPassword from "./pages/CheckPassword";
import AppLayout from "./AppLayout";
import MessagePage from "./components/MessagePage";
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import AuthLayout from "./AuthLayout";
import ForgetPassword from "./pages/ForgetPassword";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="register" element={<RegisterPage />} />
          <Route path="email" element={<CheckEmail />} />
          <Route path="password" element={<CheckPassword />} />
          <Route path="login" element={<Login />} />
          <Route path="forget-password" element={<ForgetPassword />} />
        </Route>
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
