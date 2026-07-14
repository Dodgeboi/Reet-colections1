// Lets the site be added to a phone's home screen like an app.
export default function manifest() {
  return {
    name: "Reet Collections",
    short_name: "Reet",
    description: "Handpicked Indian ethnic & fusion wear, live every evening.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF6EF",
    theme_color: "#FBF6EF",
    icons: [
      { src: "/images/logo-gold.png", sizes: "1080x1080", type: "image/png", purpose: "any" },
    ],
  };
}
