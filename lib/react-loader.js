'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'); //eslint-disable-line no-unused-vars
var deepEqual = require('deep-eql');

module.exports = function ReactLoader() {
	var _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var options = Object.assign({
		component: null,
		errorComponent: function errorComponent() {
			return React.createElement(
				'div',
				null,
				'Impossible to fetch the data requested.'
			);
		},
		loadingComponent: function loadingComponent() {
			return React.createElement(
				'div',
				null,
				'Loading...'
			);
		},
		componentWillUpdate: function componentWillUpdate() {},
		componentWillUnmount: function componentWillUnmount() {},
		isLoaded: function isLoaded() {
			return false;
		},
		isError: function isError() {
			return false;
		}
	}, _options);

	if (!options.component) {
		throw new Error('No component defined. Cannot render');
	}

	var Component = options.component;
	var ErrorComponent = options.errorComponent;
	var LoadingComponent = options.loadingComponent;

	var _componentWillUpdate = options.componentWillUpdate;
	var _componentWillUnmount = options.componentWillUnmount;

	var Loader = function (_React$Component) {
		_inherits(Loader, _React$Component);

		function Loader() {
			_classCallCheck(this, Loader);

			return _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).apply(this, arguments));
		}

		_createClass(Loader, [{
			key: 'componentWillMount',
			value: function componentWillMount() {
				_componentWillUpdate(this.props);
			}
		}, {
			key: 'componentWillUpdate',
			value: function componentWillUpdate(nextProps) {
				_componentWillUpdate(nextProps);
			}
		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				_componentWillUnmount(this.props);
			}
		}, {
			key: 'render',
			value: function render() {
				var props = this.props;

				if (options.isError(props)) {
					return React.createElement(ErrorComponent, props);
				} else if (options.isLoaded(props)) {
					return React.createElement(Component, props);
				} else {
					return React.createElement(LoadingComponent, props);
				}
			}
		}, {
			key: 'shouldComponentUpdate',
			value: function shouldComponentUpdate(nextProps) {
				return !deepEqual(this.props, nextProps);
			}
		}]);

		return Loader;
	}(React.Component);

	Loader.displayName = 'ReactLoader(' + (Component.displayName || Component.name) + ')';
	Loader.propTypes = Component.propTypes;

	return Loader;
};