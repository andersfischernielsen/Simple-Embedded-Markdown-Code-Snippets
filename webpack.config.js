'use strict';

const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './semcs.ts',
    output: {
        filename: 'semcs.js',
        libraryTarget: 'this',
        path: path.resolve(__dirname)
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts'],
        modules: ["node_modules"]
    },
    externals: [nodeExternals()],
    plugins: [new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })],
}