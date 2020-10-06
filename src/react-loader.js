import React from 'react'; //eslint-disable-line no-unused-vars
import deepEqual from 'deep-eql';
import isPromise from 'is-promise';

const STATUS_FETCHING = 0;
const STATUS_LOADED = 1;
const STATUS_ERROR = -1;

const NODE_ENV = process.env.NODE_ENV || 'production';

const debug = (NODE_ENV === 'development') ? console.log : () => {};
debug('Environment:', NODE_ENV);

export default function ReactLoader(_options = {}) {
	const options = Object.assign({
		load: null,
		resultProp: 'data',
		errorProp: 'error',
		errorComponent: () => (<div>Impossible to fetch the data requested.</div>),
		loadingComponent: () => (<div>Loading...</div>),
		shouldComponentReload: (props, nextProps) => !deepEqual(props, nextProps),
		componentWillUnmount: () => {},
	}, _options);

	if (!options.load) {
		throw new Error('ReactLoader : No load() defined. Cannot create');
	}
	if (typeof(options.load) !== 'function') {
		throw new Error('ReactLoader : load must be a function returning a Promise. Cannot create');
	}

	const ErrorComponent = options.errorComponent;
	const LoadingComponent = options.loadingComponent;

	const load = options.load;
	const componentWillUnmount = options.componentWillUnmount;
	const shouldComponentReload = options.shouldComponentReload;
	const resultProp = options.resultProp;
	const errorProp = options.errorProp;

	class _Loader extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				status: STATUS_FETCHING,
			};
		}

		componentDidMount() {
			this.doLoad();
		}

		//eslint-disable-next-line no-unused-vars
		componentDidUpdate(prevProps, prevState, snapshot) {
			if (shouldComponentReload(prevProps, this.props)) {
				this.doLoad();
			}
		}

		doLoad() {
			debug('doLoad', this.props);
			this.setState({status: STATUS_FETCHING});
			const prom = load(this.props);
			if (!isPromise(prom)) {
				throw new TypeError('ReactLoader : load(props) must return a Promise/A+ compliant object');
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
				forwardProps[errorProp] = this.state.error;
				return (
					<ErrorComponent {...forwardProps}/>
				);
			}
			else if (this.state.status === STATUS_LOADED) {
				return this.renderComponent();
			}
			else {
				return (
					<LoadingComponent {...props}/>
				);
			}
		}

		//eslint-disable-next-line no-unused-vars
		shouldComponentUpdate(nextProps, nextState, nextContext) {
			return !deepEqual(this.props, nextProps) || !deepEqual(this.state, nextState);
		}
	}

	const outFn = (Component) => {
		if (typeof(Component)==='object' && Component.kind==='class') {
			return {
				...Component,
				finisher: (Class) => (...args) => {
					return new (outFn(Class))(...args);
				},
			};
		}
		else {
			class Loader extends _Loader {
				renderComponent() {
					const forwardProps = Object.assign({}, this.props);
					forwardProps[resultProp] = this.state.data;
					return (
						<Component {...forwardProps}/>
					);
				}
			}
			Loader.displayName = `ReactLoader(${Component.displayName || Component.name})`;
			Loader.propTypes = Component.propTypes;
			return Loader;
		}
	};
	return outFn;
}
