const path = require('path');

module.exports = {
    entry: './src/index.js',  // Main entry point
    output: {
        filename: 'bundle.js', 
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    devServer: {
        static: './public',  
        port: 3000,
        hot: true,
    },
    mode: 'development',
};
