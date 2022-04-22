const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const bar = require('webpack-simple-progress-bar');

module.exports = {
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
    stats: 'none',
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ["ts-loader"],
            },
            {
                test: /\.(css|scss)$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                use: ["file-loader"],
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        port: 3000,
        client: {
            progress: false,
            overlay: false,
            logging: 'none'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.html")
        }),
        new bar({
            color: '#2196f3',
            length: 30
        })
    ]
};