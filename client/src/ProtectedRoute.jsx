import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = () => {
    const token = useSelector((state)=>state.user.token);
    console.log(token);
  return ( token ? <Outlet /> : <Navigate to="/login" /> );
}

export default ProtectedRoute