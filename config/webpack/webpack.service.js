const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { DefinePlugin } = require('webpack');

const { IS_DEVELOPMENT, IS_PRODUCTION } = require('./config');

const { buildDir, devDir } = require('./paths');
const rules = require('./rules');

const outputPath = IS_PRODUCTION ? buildDir : devDir;
const bundleName = `[name].js`;

module.exports = () => {
    return {
        mode: IS_DEVELOPMENT ? 'development' : 'production',
        entry: ['./src/env', './src/index'],
        target: 'node',
        node: {
            __dirname: false, // Prevent incorrect files path
            __filename: false,
        },
        externals: [nodeExternals({ modulesDir: `./node_modules` })],
        resolve: {
            modules: [`./src`],
            extensions: ['.ts', '.js'],
        },
        output: {
            path: outputPath,
            filename: 'app.js',
            chunkFilename: bundleName,
        },
        optimization: {
            moduleIds: 'deterministic',
            splitChunks: {
                chunks: 'all',
            },
        },
        plugins: [
            new DefinePlugin({
                __DEV__: IS_DEVELOPMENT,
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1,
            }),
        ],
        module: {
            rules,
        },
        stats: 'minimal',
    };
};
