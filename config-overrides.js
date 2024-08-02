const path = require("path");

module.exports = function override(config, env) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    },
  };
  config.module.rules = [
    {
      test: /\.css$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              config: path.resolve(__dirname, "postcss.config.js"),
            },
          },
        },
      ],
    },
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: "babel-loader",
    },
  ];

  return config;
};
