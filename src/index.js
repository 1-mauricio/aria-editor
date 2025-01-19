import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";

import "./styles/styles.css";
import "./styles/auth.css";
import "./styles/post-list.css";
import "./styles/post-card.css";
import "./styles/post-editor.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<AuthProvider>
		<App />
	</AuthProvider>
);
