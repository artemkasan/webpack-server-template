const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = (env) => {
	const isDevBuild = !(env && env.prod);
	const extractCSS = new MiniCssExtractPlugin('app.css');
	
	const outputDir = (env && env.publishDir)
		? env.publishDir
		: __dirname;
	
	return {
		devtool: 'cheap-module-eval-source-map',
		entry: {
			'app': './src/index.tsx',
		},
		devServer: { hot: true, contentBase: path.resolve('./'), stats: 'errors-only', historyApiFallback: true },
		mode: isDevBuild ? 'development' : 'production',
		resolve: {
			extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss']
		},
		stats: {
			modules: false
		},
		watchOptions: {
			ignored: ['**/*.d.ts', 'node_modules']
		},
		output: {
			filename: '[name].js',
			path: path.join(outputDir, 'dist'),
			publicPath: 'dist/'
		},
		module: {
			rules:[
				{
					test: /\.tsx?$/,
					include: /src/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							cacheDirectory: true,
							babelrc: false,
							presets: [
								[
									"@babel/preset-env",
									{ targets: { browsers: "last 2 versions" } } // or whatever your project requires
								],
								"@babel/preset-typescript",
								"@babel/preset-react"
							],
							plugins: [
								// plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
								["@babel/plugin-proposal-decorators", { legacy: true }],
								["@babel/plugin-proposal-class-properties", { loose: true }],
								"react-hot-loader/babel",
							]
						}
					}
				},
				{
					test: /\.js$/,
					use: ["source-map-loader"],
					enforce: "pre"
				},
				{
					test: /\.scss$/,
					use: [
						'css-hot-loader',
						MiniCssExtractPlugin.loader,
						{
							loader: 'typings-for-css-modules-loader',
							options: {
								modules: true,
								namedExport: true,
								sass: true,
								sourceMap: true,
								camelCase: true,
								localIdentName: "[name]__[local]"
							}
						},
						"sass-loader" // compiles Sass to CSS, using Node Sass by default
					]
				},
				{
					test: /\.(png|jpg|jpeg|gif|svg)$/,
					use: 'url-loader?limit=25000'
				}
			]
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.SourceMapDevToolPlugin(),
			new webpack.NamedModulesPlugin(),
			new ForkTsCheckerWebpackPlugin(),
			extractCSS,
			new webpack.DllReferencePlugin({
				context: outputDir,
				manifest: require('./dist/vendor-manifest.json')
			}),
		].concat(isDevBuild ? [
			new webpack.SourceMapDevToolPlugin({
				filename: '[file].map', // Remove this line if you prefer inline source maps
				moduleFilenameTemplate: path.relative( 'dist',
					'[resourcePath]') // Point sourcemap entries to the original file locations on disk
			})
		] : [
			// Plugins that apply in production builds only
			new webpack.optimize.UglifyJsPlugin()
		])
	};
}