const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: [
        // "./src/client/saves.js",
        // "./src/client/helper.js",
        // "./src/client/vars.js",
        "./libs/index.js"
    ],


    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.glsl$/,
                use: [
                    {
                        loader: 'raw-loader',
                        options: {
                            esModule: false,
                        },
                    },
                ],
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['@babel/preset-env'],
            //         },
            //     },
            // },

            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
    resolve: {
        fallback: { "os": false },
        alias: {
            // three: path.resolve('./node_modules/three'),
            // three: path.resolve('./src/client/libs/three.js'),
            // threeCSG: path.resolve('./src/client/libs/ThreeCSG'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },


    output: {
        publicPath: '/',
        // clean: true,

        filename: 'bundle.js',
        // filename: '[name].js',
        path: path.resolve(__dirname, './../public/'),
    },

    optimization: {
        minimize: false,
        // runtimeChunk: 'single',
    },
    // optimization: {
    //     runtimeChunk: true
    //     // splitChunks: {
    //     //     chunks: 'all',
    //     // },
    // },

    // optimization: {
    //     minimize: true,
    //     splitChunks: {
    //         minChunks: Infinity,
    //         chunks: 'all'
    //     }
    // }
};