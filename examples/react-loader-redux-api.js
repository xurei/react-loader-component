const ReactLoader = require('react-loader-component');
const ReactRedux = require('react-redux');
const LoadingView = require('./my-loading-view');
const deepEqual = require('deep-eql');
const store = require('./my-redux-store');

function ReduxApiLoader(options) {
	options.stores = options.stores || (() => []);
	
	// Based on the options provided, create the options used by the loader
	const loaderOptions = {
		component: options.component,
		errorComponent: options.errorComponent || ((props) => {
			console.error('A REST error occured; props:', props);
			return (<div>Impossible to fetch the data requested.</div>);
		}),
		loadingComponent: LoadingView,
		componentWillUpdate: (props) => {
			// Loop through all the store names required and dispatch the action with arguments (if provided)
			options.stores.forEach(storeItem => {
				const prop = props[storeItem.name];
				const args = typeof(storeItem.args) === 'function' ? storeItem.args(props) : storeItem.args || {};
				args.pathvars = args.pathvars || {};
				args.body = args.body || {};
				
				if (prop.sync === false || !deepEqual(prop.request, args)) {
					store.dispatch(store.actions[storeItem.name](args.pathvars, {
						body: args.body
					}));
				}
			});
		},
		
		isLoaded: (props) => {
			// Loop through all the store names required and check that the status flags match a loaded state
			const propStillLoading = options.stores.find(store => {
				const prop = props[store.name];
				return !prop || prop.loading || !prop.sync;
			});
			return typeof(propStillLoading) === 'undefined';
		},
		
		isError: (props) => {
			// Loop through all the store names required and check that the status flags match an error state
			const propInError = options.stores.find(store => {
				const prop = props[store.name];
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
			options.stores.forEach(store => {
				props[store.name] = state[store.name];
			});
			return props;
		}
	)(Out);
}

module.exports = ReduxApiLoader;
//----------------------------------------------------------------------------------------------------------------------

// Usage example :
class MyPureComponent extends React.Component {
	/* ... */
}

MyPureComponent = ReduxApiLoader({
	component: MyPureComponent,
	errorComponent: () => (<div>Oh no ! There was an error :-(</div>),
	stores: [
		{ name: 'rest_endpoint_1' },
		{ name: 'rest_endpoint_2', args: {
				pathvars: { id: 42 },
				body: {}
			}
		},
		{ name: 'rest_endpoint_3', args: (props) => ({
			pathvars: { some_pathvar: props.some_prop },
			body: { some_body: props.some_prop },
		})},
	]
});

