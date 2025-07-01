import { useState } from "react"
import SignUp from "./SignUp"
import SignIn from "./SignIn"
import loginImage from "../../assets/login_image.jpg"


const Auth = () => {
  const [activeTab,setActiveTab] = useState("login")
  return (
    <div className="w-full flex justify-center items-center h-full bg-gray-100">
        <div className="container w-[90%] h-[92%] flex">
            <div className="h-full w-1/2 rounded-l-lg bg-[#141414] text-white flex flex-col justify-center items-center">
              {
                activeTab == "register" ? (
                  <SignUp activeTab={activeTab} setActiveTab={setActiveTab}/> 
                ) : (
                  <SignIn activeTab={activeTab} setActiveTab={setActiveTab} />
                )
              }
            </div>
            <div className="right rounded-r-lg w-1/2 bg-white">
              <img src={loginImage} alt="" className="w-full h-full rounded-r-lg object-fit" />
            </div>
        </div>
    </div>
  )
}

export default Auth