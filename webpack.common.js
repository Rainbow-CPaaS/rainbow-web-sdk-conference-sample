const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: Path.resolve('./src/scripts/index.js')
    },
    output: {
        path: Path.join(__dirname, './build'),
        filename: 'js/script.js'
    },
    optimization: {
        // splitChunks: {
        // chunks: 'all',
        // name: false
        // }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{ from: Path.resolve(__dirname, './public'), to: 'public' }]),
        new HtmlWebpackPlugin({
            template: Path.resolve(__dirname, './src/index.html')
        })
    ],
    resolve: {
        alias: {
            '~': Path.resolve(__dirname, './src')
        }
    },
    devServer: {
        contentBase: Path.join(__dirname, '/src'),
        filename: 'script.js',
        compress: true,
        headers: {
            'content-type': 'text/html'
        },
        watchContentBase: true
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            },
            {
                test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                }
            }
        ]
    }
};
