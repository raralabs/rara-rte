// import postcss from 'rollup-plugin-postcss'
const postcss = require('rollup-plugin-postcss');
const images = require('@rollup/plugin-image');

module.exports = {
    rollup(config, options) {
        config.plugins = [
            images({ include: ['**/*.png', '**/*.jpg','**/*.svg'] }),
            ...config.plugins,
        ];
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
    }
};