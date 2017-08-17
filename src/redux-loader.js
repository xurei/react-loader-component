const React = require('react'); //eslint-disable-line no-unused-vars
const deepEqual = require('deep-eql');

module.exports = function ReduxLoader(_options = {}) {
	const options = Object.assign({
		component: null,
		errorComponent: () => (<div>Impossible to fetch the data requested.</div>),
		loadingComponent: () => (<div>Loading...</div>),
		componentDidMount: () => {},
		componentWillUnmount: () => {},
		isLoaded: (props) => false,
		isError: (props) => false
	}, _options);
	
	if (!options.component) {
		throw new Error('No component defined. Cannot render');
	}
	
	const Component = options.component;
	const ErrorComponent = options.errorComponent;
	const LoadingComponent = options.loadingComponent;
	
	const componentDidMount = options.componentDidMount;
	const componentWillUnmount = options.componentWillUnmount;
	
	class Loader extends React.Component {
		componentDidMount() {
			componentDidMount(this.props);
		}
		componentWillUnmount() {
			componentWillUnmount(this.props);
		}
		
		render() {
			const props = this.props;
			
			if (options.isLoaded(props)) {
				return (
					<Component {...props}/>
				);
			}
			else if (options.isError(props)) {
				return (
					<ErrorComponent {...props}/>
				);
			}
			else {
				return (
					<LoadingComponent {...props}/>
				);
			}
		}
		
		shouldComponentUpdate(nextProps) {
			try {
				return !deepEqual(this.props, nextProps);
			}
			catch (e) {
				console.warn(e);
				return true;
			}
		}
	}
	Loader.displayName = `ReduxLoader(${Component.displayName || Component.name})`;
	Loader.propTypes = Component.propTypes;
	
	return Loader;
};
