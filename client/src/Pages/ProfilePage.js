import React, { useState, useRef, useEffect } from "react";
import {
	User,
	Mail,
	Calendar,
	Lock,
	Pencil,
	X,
	Check,
	ChevronLeft,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../API/api";

const ProfileDetail = ({ icon: Icon, label, value, onEdit }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(value);

	useEffect(() => {
		setEditValue(value);
	}, [value]);

	const handleSave = async () => {
		try {
			const updateData = {
				username: label === "Username" ? editValue : undefined,
				email: label === "Email" ? editValue : undefined,
				dob: label === "Date of Birth" ? editValue : undefined,
			};

			const filteredUpdateData = Object.fromEntries(
				Object.entries(updateData).filter(([_, v]) => v != null)
			);

			await api.post("/user/update-details", filteredUpdateData);

			onEdit(editValue);
			setIsEditing(false);
		} catch (error) {
			console.error("Update failed", error);
			alert(error.response?.data?.message || "Update failed");
		}
	};

	return (
		<div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
			<div className="flex items-center space-x-4">
				<Icon className="w-5 h-5 text-gray-400" />
				<div>
					<p className="text-sm text-gray-400">{label}</p>
					{isEditing ? (
						<input
							type={label === "Date of Birth" ? "date" : "text"}
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
							className="bg-gray-700 text-gray-200 px-2 py-1 rounded-md"
						/>
					) : (
						<p className="text-gray-200">{value}</p>
					)}
				</div>
			</div>
			<div className="flex space-x-2">
				{isEditing ? (
					<>
						<button
							onClick={handleSave}
							className="p-1 text-green-500 hover:text-green-400"
						>
							<Check className="w-4 h-4" />
						</button>
						<button
							onClick={() => {
								setIsEditing(false);
								setEditValue(value);
							}}
							className="p-1 text-red-500 hover:text-red-400"
						>
							<X className="w-4 h-4" />
						</button>
					</>
				) : (
					<button
						onClick={() => setIsEditing(true)}
						className="p-1 text-gray-400 hover:text-gray-300"
					>
						<Pencil className="w-4 h-4" />
					</button>
				)}
			</div>
		</div>
	);
};

const PasswordUpdate = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handlePasswordUpdate = async (e) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			alert("New passwords do not match");
			return;
		}

		try {
			await api.post("/user/update-password", {
				currentPassword,
				newPassword,
			});
			alert("Password updated successfully");
			setIsOpen(false);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			console.error("Password update failed", error);
			alert(error.response?.data?.message || "Password update failed");
		}
	};

	return (
		<div className="mt-4">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full p-4 bg-gray-800 rounded-lg text-left flex items-center justify-between"
			>
				<div className="flex items-center space-x-4">
					<Lock className="w-5 h-5 text-gray-400" />
					<span className="text-gray-200">Update Password</span>
				</div>
				<Pencil className="w-4 h-4 text-gray-400" />
			</button>

			{isOpen && (
				<form
					onSubmit={handlePasswordUpdate}
					className="mt-4 space-y-4"
				>
					<input
						type="password"
						placeholder="Current Password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						className="w-full p-3 bg-gray-800 text-gray-200 rounded-lg border border-gray-700"
						required
					/>
					<input
						type="password"
						placeholder="New Password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						className="w-full p-3 bg-gray-800 text-gray-200 rounded-lg border border-gray-700"
						required
					/>
					<input
						type="password"
						placeholder="Confirm New Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="w-full p-3 bg-gray-800 text-gray-200 rounded-lg border border-gray-700"
						required
					/>
					<button
						type="submit"
						className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-gray-100 rounded-lg transition-colors duration-200"
					>
						Update Password
					</button>
				</form>
			)}
		</div>
	);
};

const ProfilePage = () => {
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const [avatar, setAvatar] = useState(null);
	const location = useLocation();
	const { username } = location.state || {};
	const [userProfile, setUserProfile] = useState({
		username: "",
		email: "",
		dob: "",
	});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await api.get("/user/profile", {
					headers: { username: username },
				});
				setUserProfile({
					username: res.data.username,
					email: res.data.email,
					dob: res.data.dob.slice(0, 10),
				});
			} catch (error) {
				console.error("Failed to fetch profile", error);
				alert(
					error.response?.data?.message || "Failed to fetch profile"
				);
			}
		};

		if (username) {
			fetchProfile();
		}
	}, [username]);

	const handleAvatarClick = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append("avatar", file);

			try {
				await api.post("/user/update-avatar", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				setAvatar(URL.createObjectURL(file));
			} catch (error) {
				console.error("Avatar upload failed", error);
				alert(error.response?.data?.message || "Avatar upload failed");
			}
		}
	};

	const handleLogout = async () => {
		try {
			const res = await api.get("/user/logout", {
				headers: { username: username },
			});
			navigate("/login");
		} catch (error) {
			console.error("Logout failed", error);
			alert(error.response?.data?.message || "Logout failed");
		}
	};

	const handleDetailUpdate = (field) => (value) => {
		setUserProfile((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	return (
		<div className="grid grid-rows-[64px_1fr] grid-cols-[64px_1fr] min-h-screen h-screen w-full bg-gray-900">
			<div className="row-span-2 h-full bg-gray-800 py-6 px-2 shadow-lg overflow-hidden flex flex-col">
				<div className="h-16 -mt-2 mb-4 flex items-center">
					<button
						onClick={() =>
							navigate("/chat", { state: { username: username } })
						}
						className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-full transition-colors"
					>
						<ChevronLeft className="w-6 h-6 text-indigo-500" />
					</button>
				</div>
			</div>

			<div className="w-full h-16 min-h-[64px] bg-gray-800 shadow-md px-4 border-b border-gray-700">
				<div className="h-full flex items-center justify-center">
					<h2 className="text-xl font-semibold text-gray-200">
						Profile
					</h2>
				</div>
			</div>

			<div className="w-full h-full bg-gray-900 p-8 overflow-y-auto">
				<div className="max-w-2xl mx-auto">
					<div className="bg-gray-800 rounded-lg p-6">
						<div className="flex flex-col items-center mb-8">
							<div
								onClick={handleAvatarClick}
								className="w-32 h-32 rounded-full cursor-pointer relative overflow-hidden"
							>
								{avatar ? (
									<img
										src={avatar}
										alt="Profile"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full bg-gray-700 flex items-center justify-center">
										<User className="w-16 h-16 text-gray-400" />
									</div>
								)}
								<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
									<p className="text-white text-sm">
										Change Avatar
									</p>
								</div>
							</div>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/jpeg,image/png"
								onChange={handleFileChange}
								className="hidden"
							/>
						</div>

						<div className="space-y-4">
							<ProfileDetail
								icon={User}
								label="Username"
								value={userProfile.username}
								onEdit={handleDetailUpdate("username")}
							/>

							<ProfileDetail
								icon={Mail}
								label="Email"
								value={userProfile.email}
								onEdit={handleDetailUpdate("email")}
							/>

							<ProfileDetail
								icon={Calendar}
								label="Date of Birth"
								value={userProfile.dob}
								onEdit={handleDetailUpdate("dob")}
							/>

							<PasswordUpdate />

							<button
								onClick={handleLogout}
								className="w-full py-3 bg-red-600 hover:bg-red-700 text-gray-100 rounded-lg transition-colors duration-200 mt-8"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
