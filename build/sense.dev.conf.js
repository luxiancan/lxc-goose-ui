const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const target = 'http://119.29.39.84:8909'; // 代理访问店铺，本地测试模式下使用


function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

console.log('\n')
console.log('This program is running at http://localhost:8080')
console.log('\n')

module.exports = {
  mode: 'development',
  entry: {
    app: resolve('src/main.js')
  },
  output: {
    path: resolve('static'),
    filename: 'index.js',
    chunkFilename: '[id].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
    },
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      },
      {
        test: /\.(jsx?|babel|es6)$/,
        loader: 'babel-loader',
        options: {
          "babelrc": true,
          "plugins": [
            "@babel/plugin-syntax-dynamic-import"
          ]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: 'localhost',
    port: '8080',
    open: true, // 启动后自动打开浏览器窗口
    overlay: { warnings: false, errors: true }, // 全局提示错误
    publicPath: '/', // 公共资源目录
    // 请求代理
    proxy: {
      // '/king_select':'http://134.175.39.17:8329',
      '/': {
        target,
        changeOrigin: true,
        pathRewrite: {},
        onProxyReq (proxyReq, req) {
          proxyReq.setHeader(
            'cookie',
            'ko_token=b25e54d65ba918bbb189bdd4b374497a'
          );
          // proxyReq.setHeader(
          //   "referer",
          //   "http://wxdd198a901fa24220.h5.inside.xiaoe-tech.com/content_page/eyJ0eXBlIjoiMiIsInJlc291cmNlX3R5cGUiOjEsInJlc291cmNlX2lkIjoiaV81ZDRhOGEwNWJmODMyX1Q1RlFid1BDIiwiYXBwX2lkIjoiYXBwcGNIcWxUUFQzNDgyIiwicHJvZHVjdF9pZCI6InBfNWQ0OWM4Yzk0MDFmZF9RZm4zeE9oUCJ9"
          // );
          proxyReq.setHeader(
            'x-forwarded-host',
            target.includes('https://') ? target.substr('https://'.length) : target.substr('http://'.length)
          );
          proxyReq.setHeader(
            'x-forwarded-port',
            target.includes('https://') ? '443' : '80'
          );
          proxyReq.setHeader(
            'user-agent',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_6 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Mobile/15D100 MicroMessenger/7.0.1(0x17000120) NetType/WIFI Language/zh_CN'
          );
        },
        historyApiFallback: {
          rewrites: [
            { from: /.*/, to: resolve('index.html') }
          ]
        }
      }
    },
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    },
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: resolve('index.html') },
      ],
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('index.html'),
      filename: 'index.html',
    }),
    new ProgressBarPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "index.css",
      chunkFilename: "[id].css"
    }),
    new OptimizeCssAssetsPlugin()
  ]
};