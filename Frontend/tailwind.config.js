/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {
			fontFamily: {
				heading: ["Poppins-Black"],
				body: ["Poppins-Medium"],
			},
			colors: {
				transparent: "transparent",
				current: "currentColor",
				"head-gradient-blue-1": "#4E65FF",
				"head-gradient-blue-2": "#92EFFD",
				"head-gradient-green-1": " #662D8C",
				"head-gradient-green-2": "#ED1E79",
			},
		},
	},
};
