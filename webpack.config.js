module.exports = {
  entry: './src/index.js',
  output: { path: __dirname, filename: 'app.js' },
  mode: 'development',
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: [
          { loader: 'babel-loader' }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: ['src', 'node_modules']
  }
};
