var path = require('path');
module.exports = {
    context: path.join(__dirname, 'src/js'),
    entry: './MainApp.jsx',
    plugins: [],
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react']
            }
        }]
    },
    output: {
        path: path.join(__dirname, 'public/js'),
        filename: '[name].min.js'
    }
};
