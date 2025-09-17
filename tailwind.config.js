/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.js",
    "./navigation.js",
    "./components/**/*.{js,jsx}",
    "./screens/**/*.{js,jsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        haa: {
          primary: "#2563eb",   // blue-600
          accent: "#22c55e",    // green-500
          muted: "#94a3b8",     // slate-400
        }
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    },
  },
  plugins: [],
}
