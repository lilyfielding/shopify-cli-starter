const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const LiquidSchemaPlugin = require("liquid-schema-plugin");

const sectionEntries = require("./utils/getSections");

module.exports = {
  stats: "minimal",
  entry: {
    global: path.resolve(__dirname, "../../src/global.js"),
    ...sectionEntries(),
  },
  output: {
    path: path.resolve(__dirname, "../../shopify/assets/"),
    filename: "[name].js",
  },
  resolve: {
    extensions: ["*", ".js", ".json"],
    alias: {
      "@": path.resolve(__dirname, "../../src/"),
      "@shopify-directory": path.resolve(__dirname, "../../shopify/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      ...(() => {
        const rules = [];

        const loaders = [
          { test: /\.(css|postcss)$/i },
          { test: /\.s[ac]ss$/i, loader: "sass-loader" },
          { test: /\.less$/i, loader: "less-loader" },
          { test: /\.styl$/i, loader: "stylus-loader" },
        ];

        loaders.forEach((element, index) => {
          rules.push({
            test: element.test,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: require(path.resolve(
                    __dirname,
                    "../postcss.config.js"
                  )),
                },
              },
            ],
          });

          if (element.loader) rules[index].use.push(element.loader);
        });

        return rules;
      })(),
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!*static*"],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new LiquidSchemaPlugin({
      from: {
        liquid: "./src/sections/liquid",
        schema: "./src/sections/schema",
      },
      to: "./shopify/sections",
    }),
  ],
};
