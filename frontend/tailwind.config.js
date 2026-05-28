export default {
    darkMode: 'selector', // Force selector mode for manual toggle
    content: [


        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],

    theme: {
        extend: {
            colors: {
                primary: "#0f172a",
                secondary: "#334155",
                accent: "#3b82f6",
            }
        },
    },
    plugins: [],
}
