const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    proxy: {
      '/elm': {
        target: 'http://192.168.30.238:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/elm': '/elm'
        }
      }
    }
  }
})

