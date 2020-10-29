const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
if (!process.env.HTTPS) process.env.HTTPS = "false";
if (!process.env.HOST) process.env.HOST = "0.0.0.0";
if (!process.env.PORT) process.env.PORT = process.env.HTTPS === "true" ? "443" : "80";

const publicPath = "/";

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: path.resolve(process.cwd(), "src"),
  output: {
    path: path.resolve(process.cwd(), "docs"),
    filename: "bundle/[name].[chunkhash:8].js",
    publicPath,
  },
  performance: { maxAssetSize: 1572864 /* 1.5MB */ },
  devtool: process.env.WEBPACK_DEV_SERVER ? "inline-source-map" : "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(tsx?|jsx?)$/,
            exclude: /node_modules/,
            use: [{ loader: "babel-loader" }],
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.(bmp|gif|ico|jpe?g|png|apng|svg|tiff|webp)$/,
            use: [
              {
                loader: "url-loader",
                options: { limit: 8192, fallback: "file-loader", name: "bundle/[name].[contenthash:8].[ext]" },
              },
            ],
          },
          {
            exclude: /\.(html|js|json|css)$/,
            use: [
              {
                loader: "file-loader",
                options: { name: "bundle/[name].[contenthash:8].[ext]" },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          noErrorOnMissing: true,
          globOptions: { ignore: [path.resolve("public/{index.html,favicon.png,bundle}")] },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      inject: true,
      minify: false,
      template: path.resolve("public/index.html"),
      favicon: path.resolve("public/favicon.png"),
    }),
  ],
  devServer: {
    publicPath,
    contentBase: path.resolve("public"),
    disableHostCheck: true,
    historyApiFallback: true,
    compress: true,
    host: process.env.HOST,
    https: process.env.HTTPS === "true",
    port: Number.parseInt(process.env.PORT, 10),
    stats: "minimal",
    open: true,
    openPage: "http://localhost",
  },
};
