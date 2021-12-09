const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
    mode: 'jit',
    purge: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.js',
    ],

    safelist: [
        'w-0'
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                lime: colors.lime
            }
        }
    },

    variants: {
        extend: {
            opacity: ['disabled'],
            ringWidth: ['focus'],
        },
    },

    corePlugins: {
        preflight: false,
    },

    plugins: [require('@tailwindcss/forms')],
};
