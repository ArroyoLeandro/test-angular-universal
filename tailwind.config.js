module.exports = {
    purge: {
        enabled: true,
        content: [
            './src/**/*.html', './src/**/*.ts'
        ],
    },
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
            screens: {
                'xs': '475px',
            },
            spacing: {
                '101': '30rem',
            },
            colors: {
                'principal': "#960E2B",
                'principal-medio': "#EA1400",
                'principal-claro': "#E6E8EC",
                'principal-hover': '#222222',
                'principal-oscuro': '#D9D9D9',
                'secundario': '#EA1400',
                'terciario': '#2190ab',
                'success': '#24B865',
                'success-hover': '#15A253',
                'danger': '#EA3043',
                'danger-hover': '#D4172B',
                'warning': '#F9CA44',
                'warning-hover': '#E9B82C',
                'info': '#2E3438',
                'info-hover': '#2FB8E8',
                'whatsapp': '#38c14d',
                gris: {
                    'claro': '#cdcccc',
                    'medio': '#87868a',
                    'oscuro': '#222222',
                },
                wholesale: {
                    'principal': '#92D0AA',
                    'secundario': '#f7bce2',
                }

            },
            boxShadow: {
                base: '0 2px 7px 0 rgba(0, 0, 0, 0.25)',
            }
        },
        fontFamily: {
            poppins: [
                'Work Sans', 'Arial', 'Helvetica', 'sans-serif'
            ]
        },
    },
    variants: {
        extend: {
            backgroundOpacity: ['group-focus'],
            opacity: ['group-focus'],
            backgroundColor: ['group-focus'],
            maxHeight: ['group-focus', 'focus-within'],
            rotate: ['group-focus'],
            width: ['hover', 'focus', 'group-focus', 'focus-within'],
            position: ['focus-within'],
            inset: ['focus-within'],
        },
    },
    plugins: [

    ],
}