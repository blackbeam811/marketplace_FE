import * as webpack from "webpack";
import * as path from "path";

const config: webpack.Configuration = {
  // Entry point of your application
  entry: "./src/index.tsx",

  // Output configuration
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  // Module resolution
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  // Module rules for handling different file types
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  // Plugins configuration
  plugins: [
    new webpack.ContextReplacementPlugin(
      /crypto-hash/,
      path.resolve(__dirname, "node_modules/crypto-hash/")
    ),
  ],
};

export default config;
