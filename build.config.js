module.exports = {
    entry: 'src/index.js',
    webpack: {
        devtool: 'eval',
        node: {
           fs: "empty"
        }
    }
}
