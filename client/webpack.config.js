module.exports = {
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.s(c|a)ss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            // Requires >= sass-loader@^8.0.0
            options: {
              implementation: require("sass"),
              sassOptions: {
                indentedSyntax: true, // optional
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        include: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-syntax-dynamic-import"],
          },
        },
      },
      {
        test: /.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
      },
    ],
  },
  externals: function (context, request, callback) {
    if (/xlsx|canvg|pdfmake/.test(request)) {
      return callback(null, "commonjs " + request);
    }
    callback();
  },
};
