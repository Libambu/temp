const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    proxy: {
      '/elm': {
        target: 'localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/elm': '/elm'
        }
      }
    }
  }
})

