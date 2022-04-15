const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
// const webpackBundleAnalizer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    mode: 'development',
    target: 'web',
    watch: true,
    entry: './front/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    // options: {
                    //     plugins: ["@babel/plugin-transform-object-assign"], // ensure compatibility with IE 11
                    // },
                },
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    output: {
        filename: 'main.js',
        path: path.join(__dirname, 'front', 'dist')
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'Place It (Clon)',
            filename: 'index.html',
            template: 'front/index.html'
        }),
        // new webpackBundleAnalizer()
    ],
    externals: {
        bufferutil: "bufferutil",
        "utf-8-validate": "utf-8-validate",
    }
}