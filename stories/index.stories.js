/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';

import ReactLoader from '../src/react-loader';
import promsleep from 'promsleep';

storiesOf('ReactLoader')
.add('Minimal example', () => {
	//The pure component
	const MyPureComponent = (props) => (
		<div>Content loaded: {JSON.stringify(props)}</div>
	);

	//It gets wrapper around the ReactLoader
	let MyComponent = ReactLoader({
		errorComponent: (props) => (<div>An error occurred : {JSON.stringify(props.error)}</div>),
		loadingComponent: () => (<div>Loading. Content takes 2s to load</div>),
		load: (props) => {
			//Faking an async call by waiting 2 seconds
			return Promise.resolve()
				.then(() => promsleep(2000, 42))
				.then(() => 42);
		},
	})(MyPureComponent);

	return (
		<MyComponent/>
	);
})
.add('Returns error', () => {
	//The pure component
	const MyPureComponent = (props) => (
		<div>Content loaded : {props.data}</div>
	);

	const MyComponent = ReactLoader({
		resultProp: 'data',
		errorComponent: (props) => (<div>An error occurred : {JSON.stringify(props.error)}</div>),
		loadingComponent: (props) => (<div>Loading. Content takes 2s to load</div>),
		load: () => {
			return Promise.resolve()
				.then(() => promsleep(2000, 42))
				.then(() => { throw 'my_error_message'; });
		}
	})(MyPureComponent);

	return (
		<MyComponent/>
	);
})
.add('As a decorator', () => {
	@ReactLoader({
		resultProp: 'data',
		errorComponent: (props) => (<div>An error occurred : {JSON.stringify(props.error)}</div>),
		loadingComponent: (props) => (<div>Loading. Content takes 2s to load</div>),
		load: () => {
			return Promise.resolve()
				.then(() => promsleep(2000, 42))
				.then(() => 'OK!');
		}
	})
	class MyComponent extends React.PureComponent {
		render() {
			const props = this.props;
			return (
				<div>Content loaded : {props.data}</div>
			);
		}
	}

	return (
		<MyComponent/>
	);
})
.add('ERR Missing component', () => {
	const MyComponent = ReactLoader({
		load: () => {
			return Promise.resolve(42);
		},
	});

	return (
		<MyComponent/>
	);
})
.add('ERR Missing load', () => {
	const MyComponent = ReactLoader({
	})((props) => (<div>Content loaded : {props.data}</div>));

	return (
		<MyComponent/>
	);
})
.add('ERR load() does not return a promise', () => {
	const MyComponent = ReactLoader({
		load: () => {
			return 42;
		}
	})((props) => (<div>Content loaded : {props.data}</div>));

	return (
		<MyComponent/>
	);
});
