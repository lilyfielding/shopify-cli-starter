const path = require("path");

module.exports = {
  theme: {
    extend: {},
    container: {
      center: true,
      padding: "1rem",
    },
  },
  variants: {},
  plugins: [],
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: [path.resolve(__dirname, "../shopify/**/*.liquid")],
  },
};
