import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import CheckEmail from "../pages/CheckEmail";
import CheckPassword from "../pages/CheckPassword";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";

const router = createBrowserRouter([
   {
      path:"/",
      element:<App />,
      children:[
         {
            path:"email",
            element:<CheckEmail />
         },
         {
            path:"password",
            element:<CheckPassword />
         },
         {
            path:"forgot-password",
            element:<CheckPassword />
         },
         {
            path:"",
            element:<Home />,
            children:[
               {
                  path:":userId",
                  element:<MessagePage />
               }
            ]
         }
      ]
   }
])

export default router