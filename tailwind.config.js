/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ORIGINAL brand palette: black · gold · pink · white (warm, refined)
        onyx: "#1A130D",
        "onyx-soft": "#2A201A",
        ivory: "#FBF6EF",
        white: "#FFFFFF",
        gold: "#C9A24B",
        "gold-deep": "#B8860B",
        "gold-light": "#E6C66E",
        blush: "#F6DEE2",
        rose: "#C9737F",
        "rose-deep": "#A85563",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      letterSpacing: { label: "0.24em" },
      boxShadow: {
        card: "0 18px 50px -24px rgba(26,19,13,0.45)",
        soft: "0 10px 30px -18px rgba(26,19,13,0.35)",
      },
      backgroundImage: {
        "gold-grad": "linear-gradient(135deg,#B8860B,#E6C66E 50%,#B8860B)",
        "henna": "radial-gradient(circle at 1px 1px, rgba(201,162,75,0.30) 1px, transparent 0)",
      },
      keyframes: {
        sheen: { "0%": { backgroundPosition: "200% center" }, "100%": { backgroundPosition: "-200% center" } },
        pulseSoft: { "0%,100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: "0.5", transform: "scale(0.85)" } },
      },
      animation: {
        sheen: "sheen 6s linear infinite",
        pulseSoft: "pulseSoft 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
