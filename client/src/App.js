import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ProfilePage from "./Pages/ProfilePage";
import CreateGroupPage from "./Pages/CreateGroupPage";
import GroupDetailsPage from "./Pages/GroupDetailsPage";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/chat" element={<ChatPage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/creategroup" element={<CreateGroupPage />} />
				<Route path="/groupDetails" element={<GroupDetailsPage />} />
			</Routes>
		</Router>
	);
};

export default App;
