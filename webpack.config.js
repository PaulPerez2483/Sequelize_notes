module.exports = {
	// this is a module with the rules i would like to apply
	module: {
		rules: [
			{
				//if webpack runs into a file that ends with JS do the following:
				test: /\.js$/,
				// dont include files that are in the node_module
				exclude: /node_modules/,
				use: {
					// use the following loaders: babel-loader - babel-core - @babel/preset-react
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-react"]
					}
				}
			}
		]
	}
};
