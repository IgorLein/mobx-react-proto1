var path = require('path');
var webpack = require('webpack');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        vendor: ['react', 'react-dom', 'react-router'],
        app: [
            'babel-polyfill',
            './src/index'
        ],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'assets/[name].[hash].js',
        chunkFilename: 'assets/[name].[chunkhash].js'
    },
    devtool: 'cheap-module-source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            include: path.join(__dirname, 'src'),
            loader: 'babel-loader',
            query: {
                "presets": [[ "es2015", { modules: false } ], "stage-0", "react"],
                "plugins": ['transform-async-to-generator', 'transform-decorators-legacy']
            }
        }, {
            test: /\.scss|css$/i,
            loader: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'resolve-url-loader', 'sass-loader?sourceMap']),
        }, {
            test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)$/i,
            loaders: [
                'file-loader?hash=sha512&digest=hex&name=assets/[hash].[ext]'
            ]
        }]
    },
    plugins: [
        new CopyWebpackPlugin([
            // {output}/file.txt
            { from: 'src/components/chartiq.js', to: 'src/components/chartiq.js' },
            { from: 'src/components/addOns.js', to: 'src/components/addOns.js' }
        ]),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.LoaderOptionsPlugin({
            test: /\.scss$/,
            debug: true,
            options:  {
                postcss: function() {
                    return [precss, autoprefixer];
                },
                context: path.join(__dirname, 'src'),
                output: {
                    path: path.join(__dirname, 'dist')
                }
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin("assets/styles.css"),
        new HtmlWebpackPlugin({
            hash: false,
            template: './index.hbs'
        })
    ],
};
