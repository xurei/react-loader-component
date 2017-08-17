const ReactLoader = require('react-loader-component');
const ReactRedux = require('react-redux');
const LoadingView = require('./my-loading-view');
const store = require('./my-redux-store');

const ReduxApiLoader = module.exports = function ReduxApiLoader(options) {
	// Based on the options provided, create the options used by the loader
	const loaderOptions = {
		component: options.component,
		errorComponent: options.errorComponent,
		loadingComponent: LoadingView,
		componentDidMount: () => {
			// Loop through all the store names required and dispatch the default action
			options.stores.forEach(storeName => {
				store.dispatch(store.actions[storeName]());
			});
		},
		isLoaded: (props) => {
			// Loop through all the store names required and check that the status flags match a loaded state
			const propStillLoading = options.stores.find(storeName => {
				const prop = props[storeName];
				return !prop || prop.loading || !prop.sync;
			});
			return typeof(propStillLoading) === 'undefined';
		},
		isError: (props) => {
			// Loop through all the store names required and check that the status flags match an error state
			const propInError = options.stores.find(storeName => {
				const prop = props[storeName];
				return !prop || !!prop.error;
			});
			return typeof(propInError) !== 'undefined';
		}
	};
	
	const Out = ReactLoader(loaderOptions);
	
	//Connect directly with redux using the `stores` option
	return ReactRedux.connect(
		state => {
			const props = {};
			options.stores.forEach(storeName => {
				props[storeName] = state[storeName];
			});
		}
	)(Out);
};

//----------------------------------------------------------------------------------------------------------------------

// Usage example :
class MyPureComponent extends React.Component {
	/* ... */
}

MyPureComponent = ReduxApiLoader({
	component: MyPureComponent,
	errorComponent: () => (<div>Oh no ! There was an error :-(</div>),
	stores: [
		'rest_endpoint_1',
		'rest_endpoint_2'
	]
});
