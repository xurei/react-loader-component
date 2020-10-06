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
		component: MyPureComponent,
		errorComponent: (props) => (<div>An error occured : {JSON.stringify(props.rest_endpoint.error)}</div>),
		loadingComponent: () => (<div>Loading. Content takes 2s to load</div>),
		load: (props) => {
			//Faking an async call by waiting 2 seconds
			return new Promise((resolve, reject) => {
			    setTimeout(() => resolve(42), 2000)
			});
		},
	});

	return (
		<MyComponent/>
	);
})
.add('Full example with error', () => {
	//The pure component
	const MyPureComponent = (props) => (
		<div>Content loaded : {props.data}</div>
	);

	const MyComponent = ReactLoader({
		component: MyPureComponent,
		resultProp: 'data',
		errorComponent: (props) => (<div>An error occured : {JSON.stringify(props.data)}</div>),
		loadingComponent: (props) => (<div>Loading. Content takes 2s to load</div>),
		load: () => {
			return Promise.resolve().then(() => promsleep(2000, 42)).then(() => { throw 'my_error_message'; });
		}
	});

	return (
		<MyComponent/>
	);
})
.add('ERR Missing component', () => {
	const MyComponent = ReactLoader({
		componentDidMount: () => {
			//MyService.asyncCall();
		}
	});

	return (
		<MyComponent/>
	);
})
.add('ERR Missing load', () => {
	const MyComponent = ReactLoader({
		component: (props) => (<div>Content loaded : {props.data}</div>),
	});

	return (
		<MyComponent/>
	);
})
.add('ERR load() does not return a promise', () => {
	const MyComponent = ReactLoader({
		component: (props) => (<div>Content loaded : {props.data}</div>),
		load: () => {
			return 42;
		}
	});

	return (
		<MyComponent/>
	);
});

require('./decorators.stories');
