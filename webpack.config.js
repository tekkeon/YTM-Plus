const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
var ZipPlugin = require("zip-webpack-plugin");
const manifest = require("./src/manifest.json");

module.exports = {
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    historyApiFallback: true,
    writeToDisk: true,
    disableHostCheck: true,
  },
  entry: {
    popup: path.resolve(__dirname, "./src/popup/index.tsx"),
    options: path.resolve(__dirname, "./src/options/index.tsx"),
    content: path.resolve(__dirname, "./src/content-script/index.ts"),
    background: path.resolve(__dirname, "./src/background/index.ts"),
    sync: path.resolve(__dirname, "./src/sync/index.tsx"),
    spotify: path.resolve(__dirname, "./src/content-script/spotify/index.tsx"),
    lastfm: path.resolve(__dirname, "./src/content-script/lastfm/index.ts"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                {
                  plugins: ["@babel/plugin-proposal-class-properties"],
                },
              ],
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /friends\.svg/,
        use: {
          loader: "svg-url-loader",
          options: {
            encoding: "base-64",
          },
        },
      },
      {
        test: /\.jpg|\.png/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "html/popup.html",
      template: "src/popup/index.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      filename: "html/options.html",
      template: "src/options/index.html",
      chunks: ["options"],
    }),
    new HtmlWebpackPlugin({
      filename: "html/sync.html",
      template: "src/sync/index.html",
      chunks: ["sync"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/manifest.json", to: "[name].[ext]" },
        { from: "src/assets/*.png", to: "assets/[name].[ext]" },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimize: false,
  },
};
