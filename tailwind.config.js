/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#050505",
                card: "#0A0A0A",
                border: "#1F1F1F",
            }
        },
    },
    plugins: [],
}
