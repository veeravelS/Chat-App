import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userDetails :localStorage.getItem("userDetails")==="string"?localStorage.getItem("userDetails"):
    localStorage.getItem("userDetails") ? JSON.parse(localStorage.getItem("userDetails")):[]
  },
  reducers: {
    setUsers:(state,action)=>{
      state.userDetails = action.payload;
    localStorage.setItem("userDetails",  JSON.stringify(action.payload))
    },
    setToken:(state,action)=>{
      state.token = action.payload
    },
    logout:(state,action)=>{
      state._id = "",
      state.name = "",
      state.email = "",
      state.profile_pic = ""
    }
  }
})

export const { setUsers,setToken,logout } = userSlice.actions
export default userSlice.reducer