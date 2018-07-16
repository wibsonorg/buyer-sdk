// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

const path = require("path");

module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"],
        include: path.resolve(__dirname, "../")
      },
      // "file" loader for svg
      {
        test: /\.inline\.svg$/,
        loader: "svg-inline-loader"
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'svg-react-loader',
      },
      {
        test: /\.woff$/,
        loader: "file-loader",
        query: {
          name: "fonts/[name].[hash].[ext]"
        }
      },
      {
        test: /\.woff2$/,
        loader: "file-loader",
        query: {
          name: "fonts/[name].[hash].[ext]"
        }
      },
      {
        test: /\.([ot]tf|eot)$/,
        loader: "file-loader",
        query: {
          name: "fonts/[name].[hash].[ext]"
        }
      },
      {
        test: /\.(gif|png|jpg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: '[name].[hash:8].[ext]',
        },
      },
    ]
  }
};

// {
//      test: /\.scss$/,
//      loaders: ["style-loader", "css-loader", "sass-loader"],

//    }
