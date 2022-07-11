// import postcss from 'rollup-plugin-postcss'
const postcss = require('rollup-plugin-postcss');
module.exports = {
    rollup(config, options) {
        config.plugins.push(
            postcss({
                modules: true,
                plugins: [
                ],
                // Append to <head /> as code running
                inject: true,
                // Keep it as false since we don't extract to css file anymore
                extract: false,
            })
        );
        return config;
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: false,
                        },
                    },
                ],
            },
        ],
    },
};