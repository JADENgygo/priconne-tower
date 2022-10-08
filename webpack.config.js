const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  return {
    mode: argv.mode,
    entry: "./main.js",
    output: {
      path: __dirname + "/public",
      filename: "main.js"
    },
    target: ["web", "es5"],
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                url: false,
                sourceMap: argv === "development",
                importLoaders: 2,
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: argv === "development"
              }
            }
          ]
        },
        {
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env"
                ]
              }
            }
          ]
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "style.css"
      }),
      new HtmlWebpackPlugin({
        template: "./index.html",
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "img", to: "img" }
        ]
      }),
      new CleanWebpackPlugin(),
    ]
  };
};
