const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssertsWebpackPlugin = require('optimize-css-assets-webpack-plugin');



const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;


const optimization = () => {
    const config = {
        // splitChunks: {
        //     chunks: 'all'
        // }
    }
    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssertsWebpackPlugin(), //не отптимизируетм без нее css
            new TerserWebpackPlugin(),
        ];
    }
    return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
    const use = [{
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: isDev,
            reloadAll: true
        },
    }, 'css-loader'];
    if (extra) {
        use.push(extra);
    }
    return use;
}


const plugins = () => {

    const base = [
        new HTMLWebpackPlugin({
            // title: 'Webpack Training',
            template: './index.html',
            minify: {
                collapseWhitespace: isProd,
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            //filename: '[name].[hash].css',
            filename: filename('css'),
        }),
    ];


    return base;
}

module.exports = {
    mode: 'production',
    entry: {
        main: './client/src/js/index.js',
        admin: './client/src/js/admin.js',
        root: './client/src/js/root.js',
        user: './client/src/js/user.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'client', 'dist')
    },
    watchOptions: {
        ignored: /node_modules/
    },
    optimization: optimization(),
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html',
            chunks: ['main'],
            minify: {
                collapseWhitespace: isProd
            }

        }),
        new HtmlWebpackPlugin({
            template: './client/root.html',
            filename: 'root.html',
            chunks: ['root'],
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new HtmlWebpackPlugin({
            template: './client/user.html',
            filename: 'user.html',
            chunks: ['user'],
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new HtmlWebpackPlugin({
            template: './client/admin.html',
            filename: 'admin.html',
            chunks: ['admin'],
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            // filename: filename('css'),
        }),
        new CopyWebpackPlugin([{
                from: path.resolve(__dirname, 'client', 'favicon.ico'),
                to: path.resolve(__dirname, 'client', 'dist')
            }

        ]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'client', 'src', 'images', 'closeWindow.png'),
            to: path.resolve(__dirname, 'client', 'dist')
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'client', 'src', 'images', 'down-squared.png'),
            to: path.resolve(__dirname, 'client', 'dist')
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'client', 'src', 'images', 'logo-image.png'),
            to: path.resolve(__dirname, 'client', 'dist')
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'client', 'src', 'images', 'oops.png'),
            to: path.resolve(__dirname, 'client', 'dist')
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'client', 'src', 'images', 'back.png'),
            to: path.resolve(__dirname, 'client', 'dist')
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'client', 'src', 'images', 'send-mess.png'),
            to: path.resolve(__dirname, 'client', 'dist')
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'client', 'src', 'images', 'attached.png'),
            to: path.resolve(__dirname, 'client', 'dist')
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'client', 'src', 'images', 'chatting.png'),
            to: path.resolve(__dirname, 'client', 'dist')
        }]),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'client', 'src', 'images', 'no-message.png'),
            to: path.resolve(__dirname, 'client', 'dist')
        }]),
    ],
    module: {
        rules: [{
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll: true
                    }
                }, 'css-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            }
        ]

    }
}