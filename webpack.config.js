const appName = 'mainApp';

var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
		template:  './public/js/react-apps/' +  appName + '/index.html',
		filename: 'index.html',
		inject: 'body'
});

module.exports = {
	entry: __dirname + '\\public\\js\\react-apps\\'+ appName +'\\indexApp.js',
	module : {
		rules: [
			{
				test: /\.js/,
				exclude: [
					/node_modules/
				],
				loader: 'babel-loader'
			}
		]
	},
	output:{
		filename: 'indexAppTransformed.js',
		path: __dirname + '/public/js/transformedApps/' + appName
	},
	plugins: [HTMLWebpackPluginConfig],
	mode: 'none'
};