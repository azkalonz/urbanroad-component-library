const path = require("path");

module.exports = {
  entry: "./src/embed.tsx",
  output: {
    filename: "urbanroadcomp-bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: "UrbanRoad",
    libraryTarget: "umd",
    globalObject: "this",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};
