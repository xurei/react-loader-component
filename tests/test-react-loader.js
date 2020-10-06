import 'jsdom-global/register'; //Must be before React

import React from 'react';
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import chaiEnzyme from 'chai-enzyme';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import promsleep from 'promsleep';

Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());
chai.use(sinonChai);
chai.use(dirtyChai);

Enzyme.configure({ adapter: new Adapter() })

const ReactLoader = require('../src/react-loader');

const mockPromise = () => {
	let resolve = null;
	let reject = null;
	const promise = new Promise((_resolve, _reject) => { resolve = _resolve; reject = _reject; });

	return {
		promise,
		resolve,
		reject,
		fn: () => promise
	};
};

const MyReactLoader = (options) => {
	return ReactLoader(Object.assign({
		resultProp: 'data',
		component: (props) => (<div><span>Loaded !</span><span>{props.data}</span></div>),
		loadingComponent: () => (<div>Loading</div>),
		errorComponent: (props) => (<div><span>Error:</span><span>{props.data}</span></div>)
	}, options));
};

/** @namespace describe */
/** @namespace it */
/** @namespace beforeEach */
/** @namespace before */

describe('ReactLoader', function() {
	describe('component', function() {
		it('is required', function() {
			//Prepare + Execute (1)
			const fn = () => ReactLoader({});

			//Verify (1)
			expect(fn).to.throw(/ReactLoader : No component defined. Cannot create/);

			//Prepare + Execute (2)
			const fn2 = () => ReactLoader();

			//Verify (2)
			expect(fn2).to.throw(/ReactLoader : No component defined. Cannot create/);
		});

		it('is not rendered while the promise has not finished', function(done) {
			//Prepare
			const prom = mockPromise();
			const Component = MyReactLoader({
				load: () => prom.promise
			});

			//Execute (1)
			const component = mount(
				<Component prop1="ok" prop2={42}/>
			);

			//Verify (1)
			expect(component.update().html()).to.eq('<div>Loading</div>');

			//Execute (2)
			prom.resolve('hello world');

			//Verify (2)
			setImmediate(() => {
				expect(component.update().html()).to.eq('<div><span>Loaded !</span><span>hello world</span></div>');
				done();
			});
		});
	});

	describe('errorComponent', function() {
		it('is not required', function() {
			//Prepare
			const Component = ReactLoader({
				component: (props) => (<div><span>Loaded !</span><span>{props.data}</span></div>),
				load: () => Promise.reject('error'),
			});

			//Execute
			mount(
				<Component prop1="ok" prop2={42}/>
			);

			//Nothing to verify. No throw === success
		});

		describe('and Promise waiting', function() {
			it('should not be rendered', function(done) {
				//Prepare
				const Component = MyReactLoader({
					load: mockPromise().fn,
				});

				//Execute
				const component = mount(
					<Component prop1="ok" prop2={42}/>
				);

				//Verify
				setImmediate(() => {
					expect(component.update().html()).to.eq('<div>Loading</div>');
					done();
				});
			});
		});
		describe('and Promise failed', function() {
			it('should be rendered', function(done) {
				//Prepare
				const Component = MyReactLoader({
					load: () => Promise.reject('error'),
				});

				//Execute
				const component = mount(
					<Component prop1="ok" prop2={42}/>
				);

				//Verify
				setImmediate(() => {
					expect(component.update().html()).to.eq('<div><span>Error:</span><span>error</span></div>');
					done();
				});
			});
		});
		describe('and Promise done', function() {
			it('should not be rendered', function(done) {
				//Prepare
				const Component = MyReactLoader({
					load: () => Promise.resolve('it works'),
			});

			//Execute
			const component = mount(
				<Component prop1="ok" prop2={42}/>
			);

			//Verify
				setImmediate(() => {
					expect(component.update().html()).to.eq('<div><span>Loaded !</span><span>it works</span></div>');
					done();
				});
			});
		});
	});

	describe('loadingComponent', function() {
		it('is not required', function() {
			//Prepare
			const Component = ReactLoader({
				component: (props) => (<div><span>Loaded !</span><span>{props.data}</span></div>),
				load: () => Promise.reject('error'),
			});

			//Execute
			mount(
				<Component prop1="ok" prop2={42}/>
			);

			//Nothing to verify. No throw === success
		});

		describe('and Promise waiting', function() {
			it('should not be rendered', function(done) {
				//Prepare
				const Component = MyReactLoader({
					load: mockPromise().fn,
				});

				//Execute
				const component = mount(
					<Component prop1="ok" prop2={42}/>
				);

				//Verify
				setImmediate(() => {
					expect(component.update().html()).to.eq('<div>Loading</div>');
					done();
				});
			});
		});
		describe('and Promise failed', function() {
			it('should not be rendered', function(done) {
				//Prepare
				const Component = MyReactLoader({
					load: () => Promise.reject('error'),
				});

				//Execute
				const component = mount(
					<Component prop1="ok" prop2={42}/>
				);

				//Verify
				setImmediate(() => {
					expect(component.update().html()).to.eq('<div><span>Error:</span><span>error</span></div>');
					done();
				});
			});
		});
		describe('and Promise done', function() {
			it('should be rendered', function(done) {
				//Prepare
				const Component = MyReactLoader({
					load: () => Promise.resolve('it works'),
			});

			//Execute
			const component = mount(
				<Component prop1="ok" prop2={42}/>
			);

			//Verify
				setImmediate(() => {
					expect(component.update().html()).to.eq('<div><span>Loaded !</span><span>it works</span></div>');
					done();
				});
			});
		});
	});

	describe('load', function() {
		it('is required', function() {
			//Prepare + Execute (1)
			const fn = () => MyReactLoader({});

			//Verify
			expect(fn).to.throw('ReactLoader(component) : No load() defined. Cannot create');
		});

		it('accepts only functions returning Promise', function() {
			const allTests = [
				1,
				'1',
				{},
				[],
			];
			const testFn = (item) => () => {
				const Component = MyReactLoader({
					load: item
				});
				return mount(
					<Component prop1="ok" prop2={42}/>
				);
			};

			return Promise.all(allTests.map(
				(item) => {
					return Promise.resolve()
					.then(() => {
						console.log('Testing', item, '...');
						expect(testFn(item)).to.throw('ReactLoader(component) : load must be a function returning a Promise. Cannot create');
						expect(testFn(() => item)).to.throw('ReactLoader(component) : load(props) must return a Promise/A+ compliant object');
					})
				})
			);
		});

		it('should be called on mount and have the props as first argument', function() {
			//Prepare
			const spy = sinon.spy();
			const promise = mockPromise().promise;
			const Component = MyReactLoader({
				load: (props) => {
					spy(props);
					return promise;
				}
			});

			//Execute (1)
			mount(
				<Component prop1="ok" prop2={42}/>
			);

			//Verify (1)
			expect(spy).to.have.been.calledOnce();
			expect(spy).to.have.been.calledWithExactly({
				prop1: 'ok',
				prop2: 42,
			});
	});

		it('should be called again if the props change', function() {
			//Prepare
			const spy = sinon.spy();
			const promise = mockPromise().promise;
			const Component = MyReactLoader({
				load: (props) => {
					spy(props);
					return promise;
				}
			});

			//Execute (1)
			const component = mount(
				<Component prop1="ok" prop2={42}/>
			);

			//Verify (1)
			expect(spy).to.have.been.calledOnce();
			expect(spy).to.have.been.calledWithExactly({
				prop1: 'ok',
				prop2: 42,
			});

			//Execute (2)
			component.setProps({
				prop1: 'ko',
				prop2: 24,
			});

			//Verify
			expect(spy).to.have.been.calledTwice();
			expect(spy).to.have.been.calledWithExactly({
				prop1: 'ko',
				prop2: 24,
			});
		});
	});

	describe('componentWillUnmount', function() {
		it('is not required', function() {
			//Prepare
			const Component = MyReactLoader({
				load: mockPromise().fn
			});

			//Execute
			const component = mount(
				<Component prop1="ok" prop2={42}/>
			);
			component.unmount();

			//Nothing to verify. No throw === success
		});

		it('should be called once on unmount and have the props as first argument', function() {
			//Prepare
			const spy = sinon.spy();
			const Component = MyReactLoader({
				load: mockPromise().fn,
				componentWillUnmount: spy
			});

			//Execute
			const component = mount(
				<Component prop1="ok" prop2={42}/>
			);
			component.unmount();

			//Verify
			expect(spy).to.have.been.calledOnce();
			expect(spy).to.have.been.calledWithExactly({
				prop1: 'ok',
				prop2: 42,
			});
		});
	});

	describe('Full worklow', function() {
		it('should render the loading component first, then change to the loaded component after a prop change', function(done) {
			//Prepare
			let promise = mockPromise();
			const Component = MyReactLoader({
				load: () => {
					promise = mockPromise();
					return promise.promise;
				}
			});

			//Execute (1)
			const component = mount(
				<Component prop1="ok" prop2={42} />
			);

			//Verify (1)
			Promise.resolve()
			.then(() => expect(component.update().html()).to.eq('<div>Loading</div>'))

			//Execute (2)
			.then(() => promise.resolve('ok'))

			//Verify (2)
			.then(() => expect(component.update().html()).to.eq('<div><span>Loaded !</span><span>ok</span></div>'))

			//Execute (3)
			.then(() => component.setProps({prop1: 'ok', prop2: 1}))

			//Verify (3)
			.then(() => expect(component.update().html()).to.eq('<div>Loading</div>'))

			.then(() => promise.resolve('ok2'))
			.then(() => promsleep(10))
			.then(() => expect(component.update().html()).to.eq('<div><span>Loaded !</span><span>ok2</span></div>'))

			//All done
			.then(() => done())
			.catch(done);

			/*
			//Execute (3)
			component.setProps({loaded: false, error: true});

			//Verify (3)
			expect(component.update().html()).to.eq('<div>Error</div>');

			//Execute (3)
			component.setProps({loaded: true, error: true});

			//Verify (3)
			expect(component.update().html()).to.eq('<div>Error</div>');*/
		})
	});
});
