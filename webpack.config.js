const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		index: path.join(__dirname, 'main.js')
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
	},
	plugins: [
		new htmlWebpackPlugin({
			template: path.join(__dirname, 'index.html')
		})
	]
}