const React = require('react'); //eslint-disable-line no-unused-vars
const deepEqual = require('deep-eql');
const isPromise = require('is-promise');

const STATUS_FETCHING = 0;
const STATUS_LOADED = 1;
const STATUS_ERROR = -1;

const NODE_ENV = process.env.NODE_ENV || 'production';

const debug = (NODE_ENV === 'development') ? console.log : () => {};
debug('Environment:', NODE_ENV);

module.exports = function ReactLoader(_options = {}) {
	const options = Object.assign({
		component: null,
		load: null,
		resultProp: 'data',
		errorComponent: () => (<div>Impossible to fetch the data requested.</div>),
		loadingComponent: () => (<div>Loading...</div>),
		shouldComponentReload: (props, nextProps) => !deepEqual(props, nextProps),
		componentWillUnmount: () => {},
	}, _options);

	if (!options.component) {
		throw new Error('ReactLoader : No component defined. Cannot create');
	}
	const displayName = `ReactLoader(${options.component.displayName || options.component.name})`;
	if (!options.load) {
		throw new Error(`${displayName} : No load() defined. Cannot create`);
	}
	if (typeof(options.load) !== 'function') {
		throw new Error(`${displayName} : load must be a function returning a Promise. Cannot create`);
	}

	const Component = options.component;
	const ErrorComponent = options.errorComponent;
	const LoadingComponent = options.loadingComponent;

	const load = options.load;
	const componentWillUnmount = options.componentWillUnmount;
	const shouldComponentReload = options.shouldComponentReload;
	const resultProp = options.resultProp;

	class Loader extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				status: STATUS_FETCHING,
			};
		}

		componentDidMount() {
			this.doLoad();
		}
		componentDidUpdate(prevProps) {
			if (shouldComponentReload(prevProps, this.props)) {
				this.doLoad();
			}
		}

		doLoad() {
			debug('doLoad', this.props);
			this.setState({status: STATUS_FETCHING});
			const prom = load(this.props);
			if (!isPromise(prom)) {
				throw new TypeError(`${displayName} : load(props) must return a Promise/A+ compliant object`);
			}

			prom.then((data) => {
				debug('Loaded !', this.props);
				this.setState({status: STATUS_LOADED, data: data});
				return data;
			})
			.catch(e => {
				debug('Error !', this.props);
				this.setState({status: STATUS_ERROR, error: e});
			});
		}

		componentWillUnmount() {
			debug('unmount !', this.props);
			componentWillUnmount(this.props);
		}

		render() {
			debug('render');
			const props = this.props;

			if (this.state.status === STATUS_ERROR) {
				const forwardProps = Object.assign({}, props);
				if (resultProp) {
					forwardProps[resultProp] = this.state.error;
				}
				return (
					<ErrorComponent {...forwardProps}/>
				);
			}
			else if (this.state.status === STATUS_LOADED) {
				const forwardProps = Object.assign({}, props);
				if (resultProp) {
					forwardProps[resultProp] = this.state.data;
				}
				debug(props, ' => ', forwardProps);
				return (
					<Component {...forwardProps}/>
				);
			}
			else {
				return (
					<LoadingComponent {...props}/>
				);
			}
		}

		shouldComponentUpdate(nextProps, nextState) {
			return !deepEqual(this.props, nextProps) || !deepEqual(this.state, nextState);
		}
	}
	Loader.displayName = displayName;
	Loader.propTypes = Component.propTypes;

	return Loader;
};
