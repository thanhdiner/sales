const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    configure: (webpackConfig) => {
      // Swiper v11+ is ESM-only — tell CRA's Babel to transpile it
      const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf)
      if (oneOfRule) {
        const babelLoader = oneOfRule.oneOf.find(
          rule => rule.loader && rule.loader.includes('babel-loader') && rule.include
        )
        if (babelLoader) {
          delete babelLoader.include
          babelLoader.exclude = /node_modules\/(?!(swiper|ssr-window|dom7)\/).*/
        }
      }
      return webpackConfig
    }
  },
  devServer: devServerConfig => {
    const onBeforeSetupMiddleware = devServerConfig.onBeforeSetupMiddleware
    const onAfterSetupMiddleware = devServerConfig.onAfterSetupMiddleware

    if (onBeforeSetupMiddleware || onAfterSetupMiddleware) {
      devServerConfig.setupMiddlewares = (middlewares, devServer) => {
        if (typeof onBeforeSetupMiddleware === 'function') {
          onBeforeSetupMiddleware(devServer)
        }
        if (typeof onAfterSetupMiddleware === 'function') {
          onAfterSetupMiddleware(devServer)
        }
        return middlewares
      }

      delete devServerConfig.onBeforeSetupMiddleware
      delete devServerConfig.onAfterSetupMiddleware
    }

    return devServerConfig
  }
}
