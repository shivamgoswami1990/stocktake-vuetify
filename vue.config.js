module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/sass/main.scss";',
      },
    },
  }
};
