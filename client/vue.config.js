module.exports = {
  pwa: {
    themeColor: "#1f2024",
    msTileColor: "#141416",
    manifestOptions: {
      display: "fullscreen",
    },
  },
  chainWebpack: (config) => {
    config.externals([
      function (context, request, callback) {
        if (/xlsx|canvg|pdfmake/.test(request)) {
          return callback(null, "commonjs " + request);
        }
        callback();
      },
    ]);
  },
};
