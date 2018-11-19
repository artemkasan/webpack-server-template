const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
	const isDevBuild = !(env && env.prod);
	const extractCSS = new MiniCssExtractPlugin('vendor.css');
	const outputDir = (env && env.publishDir)
		? env.publishDir
		: __dirname;

	return {
		mode: isDevBuild ? 'development' : 'production',
		stats: {
			modules: false
		},
		resolve: {
			extensions: ['.js']
		},
		module: {
			rules: [{
				test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/,
				use: 'url-loader?limit=100000'
			},
			{
				test: /\.css(\?|$)/,
				use:
					[
						MiniCssExtractPlugin.loader,
						isDevBuild ? 'css-loader' : 'css-loader?minimize'
					]
			}]
		},
		entry: {
			vendor: [
				'tslib',
				'@babel/polyfill',
				'react',
				'react-dom',
				'@material-ui/core',
				'react-virtualized/styles.css'
			]
		},
		output: {
			filename: '[name].js',
			library: '[name]_[hash]',
			path: path.join(outputDir, 'dist'),
			publicPath: 'dist'
		},
		plugins: [
			extractCSS,
			new webpack.DllPlugin({
				path: path.join(outputDir, 'dist', '[name]-manifest.json'),
				name: '[name]_[hash]'
			}),
			new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/,
				require.resolve('node-noop')), // Workaround for https://github.com/andris9/encoding/issues/16
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
			}),
		].concat(isDevBuild ? [
			// Plugins that apply in development builds only
			new webpack.SourceMapDevToolPlugin({
				filename: '[file].map', // Remove this line if you prefer inline source maps
				moduleFilenameTemplate: path.relative('dist',
					'[resourcePath]') // Point sourceMap entries to the original file locations on disk
			})
		] : [
			new webpack.optimize.UglifyJsPlugin()
		])
	}
};