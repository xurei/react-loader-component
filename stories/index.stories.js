/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';

import ReactLoader from '../src/react-loader';
import promsleep from 'promsleep';

//The pure component
const MyPureComponent = (props) => (
	<div>Content loaded : {props.data}</div>
);

//storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('ReactLoader')
.add('Full example', () => {
	const MyComponent = ReactLoader({
		component: MyPureComponent,
		resultProp: 'data',
		errorComponent: (props) => (<div>An error occured : {JSON.stringify(props.rest_endpoint.error)}</div>),
		loadingComponent: (props) => (<div>Loading. Content takes 2s to load</div>),
		componentDidMount: () => {
			return Promise.resolve().then(() => promsleep(2000, 42));
		}
	});
	
	return (
		<MyComponent/>
	);
})
.add('Full example with error', () => {
	const MyComponent = ReactLoader({
		component: MyPureComponent,
		resultProp: 'data',
		errorComponent: (props) => (<div>An error occured : {JSON.stringify(props.data)}</div>),
		loadingComponent: (props) => (<div>Loading. Content takes 2s to load</div>),
		componentDidMount: () => {
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
.add('ERR Missing componentDidMount', () => {
	const MyComponent = ReactLoader({
		component: MyPureComponent,
		componentDidMount: () => {
			//MyService.asyncCall();
		}
	});
	
	return (
		<MyComponent/>
	);
});
