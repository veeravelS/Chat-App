import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import SocketProvider from "./socket/socketProvider";
const token = store.getState().user.token;
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
    <SocketProvider key={token}> 
        <App />
      </SocketProvider>
    </Provider>
  </StrictMode>
);
