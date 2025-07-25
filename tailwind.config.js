/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C5282",
        secondary: "#3182CE",
        accent: "#ED8936",
        success: "#38A169",
        warning: "#D69E2E",
        error: "#E53E3E",
        surface: "#FFFFFF",
        background: "#F7FAFC"
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #2C5282 0%, #3182CE 100%)",
        "gradient-accent": "linear-gradient(135deg, #ED8936 0%, #F6AD55 100%)",
        "gradient-surface": "linear-gradient(135deg, #FFFFFF 0%, #F7FAFC 100%)"
      }
    },
  },
  plugins: [],
}