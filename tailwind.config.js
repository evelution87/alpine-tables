const defaultTheme = require( 'tailwindcss/defaultTheme' );
const colors = require( 'tailwindcss/colors' );

module.exports = {
	content: [
		'./resources/views/**/*.blade.php',
		'./resources/js/**/*.js'
	],
	
	safelist: [
		'w-0'
	],
	
	theme: {
		extend: {
			fontFamily: {
				sans: [ 'Nunito', ...defaultTheme.fontFamily.sans ]
			},
			colors: {
				lime: colors.lime
			}
		}
	},
	
	corePlugins: {
		preflight: false
	},
	
	plugins: [
		require( '@tailwindcss/forms' )
	]
};
