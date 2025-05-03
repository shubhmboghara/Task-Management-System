import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Authprovider } from "./Context/AuthContext.jsx";
import { TaskProvider } from "./Context/TaskContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter >
            <Authprovider>
                <TaskProvider>
                    <App />
                </TaskProvider>
            </Authprovider>
        </BrowserRouter>
    </StrictMode>
);

