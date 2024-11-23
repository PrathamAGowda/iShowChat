import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserPlus, ChevronLeft } from "lucide-react";
import api from "../API/api";

const GroupDetailsPage = () => {
	const [showAddMembers, setShowAddMembers] = useState(false);
	const [newMemberUsernames, setNewMemberUsernames] = useState("");
	const [selectedNewMembers, setSelectedNewMembers] = useState([]);

	const navigate = useNavigate();
	const location = useLocation();
	const { groupName, username } = location.state;
	const [desc, setDesc] = useState("");

	useEffect(() => {
		const init = async () => {
			try {
				const res = await api.get(`/${groupName}/group-details`, {
					headers: { username: username },
				});
				console.log(res.data.description);
				setDesc(res.data.description);
			} catch (e) {
				console.log(e);
			}
		};

		init();
	});

	const addToList = () => {
		if (newMemberUsernames !== "") {
			setSelectedNewMembers([...selectedNewMembers, newMemberUsernames]);
			setNewMemberUsernames("");
		} else {
			alert("Error in adding user");
		}
	};

	const addMembers = () => {
		if (selectedNewMembers != []) {
		}
	};

	return (
		<div
			className={`grid grid-rows-[64px_1fr] grid-cols-[64px_1fr] 
      min-h-screen h-screen w-full transition-all duration-300 overflow-hidden bg-gray-900`}
		>
			<div className="row-span-2 h-full bg-gray-800 py-6 px-2 shadow-lg overflow-hidden flex flex-col">
				<div className="h-16 -mt-2 mb-4 flex items-center">
					<button
						onClick={() => navigate(-1)}
						className="w-12 h-12 flex items-center justify-center hover:bg-gray-700 rounded-full transition-colors"
					>
						<ChevronLeft className="w-6 h-6 text-indigo-500" />
					</button>
				</div>
			</div>

			<div className="w-full h-16 min-h-[64px] bg-gray-800 shadow-md px-4 border-b border-gray-700">
				<div className="h-full flex items-center justify-center">
					<div className="text-gray-200 text-lg font-semibold select-none">
						{groupName}
					</div>
				</div>
			</div>

			<div className="w-full h-full bg-gray-900 overflow-y-auto p-8 text-gray-200 scrollbar-hide">
				<div className="max-w-4xl mx-auto">
					<div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
						<h2 className="text-2xl font-bold mb-4 text-indigo-400">
							Group Description
						</h2>
						<p className="text-gray-300">{desc}</p>
					</div>

					<div className="bg-gray-800 rounded-xl p-6 shadow-lg">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-2xl font-bold text-indigo-400">
								Group Members
							</h2>
							<button
								onClick={() =>
									setShowAddMembers(!showAddMembers)
								}
								className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors"
							>
								<UserPlus className="w-5 h-5" />{" "}
								{showAddMembers ? "Hide Form" : "Add Members"}
							</button>
						</div>

						{showAddMembers && (
							<div className="mb-6 bg-gray-700 rounded-xl p-6">
								<h3 className="text-xl font-bold text-indigo-400 mb-4">
									Add New Members
								</h3>
								<div className="space-y-4">
									<div className="relative">
										<input
											type="text"
											placeholder="Enter username"
											value={newMemberUsernames}
											onChange={(e) =>
												setNewMemberUsernames(
													e.target.value
												)
											}
											className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
										/>
									</div>

									<button
										onClick={addToList}
										className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition-colors"
									>
										Find Members
									</button>
								</div>
							</div>
						)}

						<div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-hide">
							{selectedNewMembers.map((username) => (
								<div
									key={username}
									className="flex items-center justify-between bg-gray-700 rounded-lg p-4"
								>
									<div className="flex items-center space-x-4">
										<div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
											{username[0].toUpperCase()}
										</div>
										<div>
											<p className="font-semibold">
												{username}
											</p>
											<p className="text-sm text-gray-400">
												Member
											</p>
										</div>
									</div>
								</div>
							))}
						</div>

						{selectedNewMembers.length > 0 && (
							<div className="mt-6">
								<button
									onClick={() => {
										addMembers();
									}}
									className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors"
								>
									Add Selected Members
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupDetailsPage;
