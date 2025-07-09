import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import SocketProvider from "./socket/socketProvider";
import { Toaster } from "sonner";
import AppThemeProvider from "./components/AppThemeProvider";
const token = store.getState().user.token;
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider key={token}>
        <Toaster richColors position="top-right" />
        <AppThemeProvider>
          <App />
        </AppThemeProvider>
      </SocketProvider>
    </Provider>
  </StrictMode>
);
