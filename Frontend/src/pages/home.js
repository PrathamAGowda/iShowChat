import React from "react";

const Home = () => {
	return (
		<div className="bg-cover bg-center h-screen bg-[url('../public/images/image33.png')]">
			<div className="flex justify-center pt-72 font-heading text-8xl">
				<div className=" bg-gradient-to-r from-head-gradient-blue-1 to-head-gradient-blue-2 text-transparent bg-clip-text">
					iShow
				</div>
				<div className=" bg-gradient-to-r from-head-gradient-green-2 to-head-gradient-green-1 text-transparent bg-clip-text">
					Chat
				</div>
			</div>
			<div className="font-body w-96 mt-8 ms-96 text-pretty text-lg text-center font-medium text-gray-500 sm:text-xl/8">
				<p>
					Nisi fugiat reprehenderit dolor reprehenderit qui ex amet
					pariatur. Sit ut excepteur deserunt Lorem enim deserunt
					cillum id sit officia ea ut. Voluptate officia in
					adipisicing laborum nisi et tempor velit Lorem commodo Lorem
					veniam fugiat ex. Elit nulla nostrud velit velit eu
					exercitation enim.
				</p>
			</div>
			<a
				href="#"
				className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Login
			</a>
		</div>
	);
};

export default Home;
