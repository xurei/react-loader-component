const React = require('react'); //eslint-disable-line no-unused-vars
const deepEqual = require('deep-eql');

module.exports = function ReactLoader(_options = {}) {
	const options = Object.assign({
		component: null,
		errorComponent: () => (<div>Impossible to fetch the data requested.</div>),
		loadingComponent: () => (<div>Loading...</div>),
		componentWillUpdate: () => {},
		componentWillUnmount: () => {},
		isLoaded: () => false,
		isError: () => false
	}, _options);
	
	if (!options.component) {
		throw new Error('No component defined. Cannot render');
	}
	
	const Component = options.component;
	const ErrorComponent = options.errorComponent;
	const LoadingComponent = options.loadingComponent;
	
	const componentWillUpdate = options.componentWillUpdate;
	const componentWillUnmount = options.componentWillUnmount;
	
	class Loader extends React.Component {
		componentWillMount() {
			componentWillUpdate(this.props);
		}
		componentWillUpdate(nextProps) {
			componentWillUpdate(nextProps);
		}
		componentWillUnmount() {
			componentWillUnmount(this.props);
		}
		
		render() {
			const props = this.props;
			
			if (options.isError(props)) {
				return (
					<ErrorComponent {...props}/>
				);
			}
			else if (options.isLoaded(props)) {
				return (
					<Component {...props}/>
				);
			}
			else {
				return (
					<LoadingComponent {...props}/>
				);
			}
		}
		
		shouldComponentUpdate(nextProps) {
			return !deepEqual(this.props, nextProps);
		}
	}
	Loader.displayName = `ReactLoader(${Component.displayName || Component.name})`;
	Loader.propTypes = Component.propTypes;
	
	return Loader;
};
