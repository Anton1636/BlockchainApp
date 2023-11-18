/** @type {import('tailwindcss').Config} */
export default {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
	mode: 'jit',
	darkMode: false, // or 'media' or 'class'
	theme: {
		fontFamily: {
			display: ['Open Sans', 'sans-serif'],
			body: ['Open Sans', 'sans-serif'],
		},
		extend: {
			screens: {
				mf: '990px',
			},
			keyframes: {
				'slide-in': {
					'0%': {
						'-webkit-transform': 'translateX(120%)',
						transform: 'translateX(120%)',
					},
					'100%': {
						'-webkit-transform': 'translateX(0%)',
						transform: 'translateX(0%)',
					},
				},
			},
			animation: {
				'slide-in': 'slide-in 0.5s ease-out',
			},
		},
	},
	variants: {
		extend: {},
	},
	// eslint-disable-next-line no-undef
	plugins: { tailwindcss: {}, autoprefixer: {} ,require('@tailwindcss/forms') },
}
