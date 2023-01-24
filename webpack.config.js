/* global __dirname, module, require */
/* exported module */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {StatsWriterPlugin} = require('webpack-stats-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            experimentalWatchApi: true,
                            transpileOnly: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|gif)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(ttf|woff(|2)|eot|svg)$/,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].min.css',
        }),
        new HtmlWebpackPlugin({
            title: 'Guitar Amplifier',
        }),
        // Usage: npm run webpack-analyze ./path/to/stats.json
        new StatsWriterPlugin({
            fields: null,
            stats: {chunkModules: true},
        }),
    ],
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
    },
    stats: {
        colors: true,
    },
    devtool: 'source-map',
    devServer: {
        static: './dist',
    },
    optimization: {
        runtimeChunk: 'single',
    },
    entry: './src/index.tsx',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'app',
        libraryTarget: 'window',
    },
};
