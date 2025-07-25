import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userDetails:
      localStorage.getItem("userDetails") === "string"
       ? JSON.parse(localStorage.getItem("userDetails"))
        :JSON.parse(localStorage.getItem("userDetails")),
    onlineUser: [],
    selectedUser: localStorage.getItem("selectedUser")
      ? JSON.parse(localStorage.getItem("selectedUser"))
      : null,
    token : sessionStorage.getItem("token") || null,
    socketConnection: null,
  },
  reducers: {
    setUsers: (state, action) => {
      state.userDetails = action.payload;
      localStorage.setItem("userDetails", JSON.stringify(action.payload));
    },
    setToken: (state, action) => {
      state.token = action.payload;
      sessionStorage.setItem("token", action.payload);
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      localStorage.setItem("selectedUser", JSON.stringify(action.payload));
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
    logout: (state, action) => {
      (state._id = ""),
        (state.name = ""),
        (state.email = ""),
        (state.profile_pic = ""),
        (state.token = "");
        state.socketConnection = null
    },
  },
});

export const { setUsers, setToken, logout, setOnlineUser,setSocketConnection,setSelectedUser } = userSlice.actions;
export default userSlice.reducer;