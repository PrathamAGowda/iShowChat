import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen h-screen w-full bg-gradient-to-r from-cyan-900 to-slate-900 flex items-center justify-center">
			<div className="max-w-4xl w-full mx-auto p-16 pt-0">
				<h1
					className="text-center text-9xl font-bold mb-6 select-none
          bg-gradient-to-r from-gray-100 via-gray-100 to-gray-100 
          hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400
          bg-clip-text text-transparent
          transition-all duration-500 ease-in-out
          hover:scale-105 transform
          hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
				>
					iShowChat
				</h1>
				<div className="text-center">
					<p className="text-gray-400 text-3xl mb-12 cursor-default">
						A Messaging platform for the new generation.
					</p>

					<div className="flex justify-around">
						<button
							onClick={() => navigate("/login")}
							className="w-1/4 h-12 rounded-lg font-medium transition-colors duration-200 
                bg-indigo-600 hover:bg-indigo-700 text-gray-100"
						>
							Sign In
						</button>

						<button
							onClick={() => navigate("/register")}
							className="w-1/4 h-12 rounded-lg font-medium transition-colors duration-200 
                bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700"
						>
							Create Account
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
