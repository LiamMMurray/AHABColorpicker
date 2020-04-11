const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.tsx',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'index_bundle.js'
    },
    module:
    {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.svg$/,
                use: ['svg-inline-loader'],
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.svg'],
        alias:
        {
            "@components": path.resolve(__dirname, './src/components'),
            "@colorpicker": path.resolve(__dirname, './src/components/colorpicker'),
            "@math": path.resolve(__dirname, './src/math'),
            "@images": path.resolve(__dirname, './src/images'),
            "@styles": path.resolve(__dirname, './src/styles'),
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
    ]
}