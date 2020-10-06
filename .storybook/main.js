module.exports = {
	stories: ['../stories/**/*.stories.@(js|mdx)'],
	addons: [
		{
	      name: '@storybook/addon-storysource',
	      options: {
	        rule: {
	          //include: [path.resolve(__dirname, '../src')], // You can specify directories
	        },
	        loaderOptions: {
	          prettierConfig: { printWidth: 100, tabWidth: 2, singleQuote: false },
	        },
	      },
	    },
	]
}
