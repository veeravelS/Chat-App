import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
    const token = useSelector((state)=>state.user.token);
  return ( token ? <Outlet /> : <Navigate to="/auth" /> );
}

export default ProtectedRoute