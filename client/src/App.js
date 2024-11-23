import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ProfilePage from "./Pages/ProfilePage";
import CreateGroupPage from "./Pages/CreateGroupPage";
import GroupDetailsPage from "./Pages/GroupDetailsPage";
import HomePage from "./Pages/HomePage";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
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
