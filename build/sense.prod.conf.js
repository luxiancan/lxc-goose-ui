const fs = require('fs');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const join = path.join;
function resolve (dir) {
  return path.resolve(__dirname, dir);
}

function getComponentEntries (path) {
  let files = fs.readdirSync(resolve(path));  
  const componentEntries = files.reduce((ret, item) => {
    const itemPath = join(path, item);
    const isDir = fs.statSync(itemPath).isDirectory();
    if (isDir) {
      ret[item] = resolve(join(itemPath, 'index.js'));
    } else {
      const [name] = item.split('.');
      ret[name] = resolve(`${itemPath}`);
    }
    return ret;
  }, {});
  return componentEntries;
}

const externals = [{
  vue: {
    root: 'Vue',
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue',
  },
  axios: 'axios',
  '@xiaoe/xiaoe-common-pay':'@xiaoe/xiaoe-common-pay',
  '@xiaoe/xiaoe-common-pay/lib/index/style.css':'@xiaoe/xiaoe-common-pay',
  'weixin-js-sdk': 'weixin-js-sdk',
  '@xiaoe/js-tools':'@xiaoe/js-tools',
  'base-64':'base-64'
}, nodeExternals()];



module.exports = {
  mode: 'production',
  entry: { ...getComponentEntries(resolve('../libEntry/install')) },
  output: {
    path: resolve('../lib'),
    filename: '[name]/index.js',
    chunkFilename: '[id].js',
    libraryExport: 'default',
    library: 'GOOSE',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('../src'),
    },
    modules: ['node_modules']
  },
  performance: {
    hints: false
  },
  optimization: {
    minimize: true
  },
  externals,
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        loader: 'babel-loader'
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
        use: ['style-loader', 
              'css-loader', 
              'postcss-loader', 
              'sass-loader',
              {
                loader: 'sass-resources-loader',
                options: {
                    resources: path.resolve('./', 'src/assets/scss/index.scss')
                }
              }
            ]
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
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: "[name].css",
    //   chunkFilename: "[id].css"
    // }),
    // new OptimizeCssAssetsPlugin(),
    new UglifyJsPlugin({}),
    new CleanWebpackPlugin({
      root:path.resolve(__dirname, '../lib')
    })
  ]
};