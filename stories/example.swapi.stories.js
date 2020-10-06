/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';

import ReactLoader from '../src/react-loader';
import promsleep from 'promsleep';

storiesOf('ReactLoader - Example SWAPI')
.add('Full example with interface', () => {
	class Main extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				currentUrl: 'people/1',
			};
		}

		render() {
			const props = this.props;
			return (
				<div style={{textAlign: 'center'}}>
					<h1>A simple example with The Star Wars API</h1>
					<a href="https://swapi.dev/">swapi.dev</a>

					<p>Click on a button to change the content</p>
					<button onClick={() => {
						this.setState({currentUrl: 'people/1'})
					}}>people/1</button>

					<button onClick={() => {
						this.setState({currentUrl: 'people/2'})
					}}>people/2</button>

					<button onClick={() => {
						this.setState({currentUrl: 'people/ERR'})
					}}>people/ERROR</button>

					<br/>
					<br/>

					<MyComponent url={this.state.currentUrl}/>
				</div>
			);
		}
	}

	let MyComponent = ReactLoader({
		errorComponent: (props) => (<div>An error occurred : {JSON.stringify(props.error)}</div>),
		loadingComponent: (props) => (<div>Loading {props.url}... Please wait</div>),
		load: (props) => {
			return Promise.all([
				fetch(`https://swapi.dev/api/${props.url}/`),
				promsleep(2000)
			])
			.then(([response, _]) => {
				if (response.status !== 200) {
					throw ('Looks like there was a problem. Status Code: ' + response.status);
				}
				else {
					return response.json();
				}
			})
		},
	})(props => {
		return <div>
			Content loaded : <br/>
			<pre style={{textAlign: 'left', maxWidth: 500, margin: '0 auto', background: '#eee'}}>
				{JSON.stringify(props.data, null, '  ')}
			</pre>
		</div>
	});

	return <Main/>;
});
