const path = require('path');

module.exports = (env, argv) => {
    const inProduction = (argv.mode === 'production');

    return {
        mode: inProduction ? 'production' : 'development',
        entry: path.join(__dirname, 'src/index.ts'),
        target: "node",

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ['ts-loader'],
                    exclude: /node_modules/,
                }
            ]
        },

        optimization: {
            minimize: inProduction,
        },

        resolve: {
            extensions: ['.ts', '.js'],
        },

        output: {
            filename: 'server.js',
            path: path.resolve(__dirname, 'dist'),
        },
    };
};