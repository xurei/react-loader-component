import 'jsdom-global/register'; //Must be before React

const React = require('react'); //eslint-disable-line no-unused-vars
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(chaiEnzyme());
chai.use(sinonChai);
chai.use(dirtyChai);

const ReactLoader = require('../src/react-loader');
const FakeComponent = require('./util/fake-component');

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
			expect(fn).to.throw(/No component defined. Cannot render/);
			
			//Prepare + Execute (2)
			const fn2 = () => ReactLoader();
			
			//Verify (2)
			expect(fn2).to.throw(/No component defined. Cannot render/);
		});
		
		it('is not rendered at all until isLoaded returns true', function() {
			//Prepare
			const Component = ReactLoader({
				//this should throw if the component is rendered and data is not set, which is the condition for isLoaded to be true
				component: (props) => (<div>{props.data.value}</div>),
				loadingComponent: (props) => (<div>Loading</div>),
				errorComponent: (props) => (<div>Error</div>),
				isError: () => false,
				isLoaded: (props) => !!props.data,
			});
			
			//Execute (1)
			const component = mount(
				<Component prop1="ok" prop2={42}/>
			);
			
			//Verify (1)
			expect(component.html()).to.eq('<div>Loading</div>');
			
			//Execute (2)
			component.setProps({data: {value: 'hello world'}});
			
			//Verify (2)
			expect(component.html()).to.eq('<div>hello world</div>');
		});
	});
	
	describe('errorComponent', function() {
		it('is not required', function() {
			//Prepare
			const Component = ReactLoader({
				component: FakeComponent,
				isError: () => true,
			});
			
			//Execute
			mount(
				<Component prop1="ok" prop2={42}/>
			);
			
			//Nothing to verify. No throw === success
		});
		
		describe('isError() === true', function() {
			it('should be rendered', function() {
				//Prepare
				const Component = ReactLoader({
					component: (props) => (<div>No Error</div>),
					errorComponent: (props) => (<div>Error</div>),
					isError: () => true,
					isLoaded: () => false,
				});
				
				//Execute
				const component = mount(
					<Component prop1="ok" prop2={42}/>
				);
				
				//Verify
				expect(component.html()).to.eq('<div>Error</div>');
			});
		});
		describe('isError() === false', function() {
			//Prepare
			const Component = ReactLoader({
				component: (props) => (<div>No Error</div>),
				errorComponent: (props) => (<div>Error</div>),
				isError: () => false,
				isLoaded: () => true,
			});
			
			//Execute
			const component = mount(
				<Component prop1="ok" prop2={42}/>
			);
			
			//Verify
			expect(component.html()).to.eq('<div>No Error</div>');
		});
	});
	
	describe('loadingComponent', function() {
		describe('isLoaded() === false', function() {
			it('should be rendered', function() {
				//Prepare
				const Component = ReactLoader({
					component: (props) => (<div>Loaded</div>),
					loadingComponent: (props) => (<div>Loading</div>),
					isError: () => false,
					isLoaded: () => false,
				});
				
				//Execute
				const component = mount(
					<Component prop1="ok" prop2={42}/>
				);
				
				//Verify
				expect(component.html()).to.eq('<div>Loading</div>');
			});
		});
		describe('isLoaded() === true', function() {
			//Prepare
			const Component = ReactLoader({
				component: (props) => (<div>Loaded</div>),
				loadingComponent: (props) => (<div>Loading</div>),
				isError: () => false,
				isLoaded: () => true,
			});
			
			//Execute
			const component = mount(
				<Component prop1="ok" prop2={42}/>
			);
			
			//Verify
			expect(component.html()).to.eq('<div>Loaded</div>');
		});
	});
	
	describe('componentWillMount', function() {
		it('should be called on mount only and have the props as first argument', function() {
			//Prepare
			const spy = sinon.spy();
			const Component = ReactLoader({
				component: FakeComponent,
				componentWillMount: spy
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
			expect(spy).to.have.been.calledOnce();
		});
	});
	
	describe('componentWillUpdate', function() {
		it('should be called on props change and have the props as first argument', function() {
			//Prepare
			const spy = sinon.spy();
			const Component = ReactLoader({
				component: FakeComponent,
				componentWillUpdate: spy
			});
			
			//Execute (1)
			const component = mount(
				<Component prop1="ok" prop2={42}/>
			);
			
			//Verify (1)
			expect(spy).to.have.not.been.called();
			
			//Execute (2)
			component.setProps({
				prop1: 'ko',
				prop2: 24,
			});
			
			//Verify (2)
			expect(spy).to.have.been.calledOnce();
			expect(spy).to.have.been.calledWithExactly({
				prop1: 'ko',
				prop2: 24,
			});
			
			//Execute (3)
			component.setProps({
				prop1: 'lol',
				prop2: 1,
			});
			
			//Verify (3)
			expect(spy).to.have.been.calledTwice();
			expect(spy).to.have.been.calledWithExactly({
				prop1: 'lol',
				prop2: 1,
			});
		});
	});
	
	describe('componentWillUnmount', function() {
		it('is not required', function() {
			//Prepare
			const Component = ReactLoader({
				component: FakeComponent,
			});
			
			//Execute
			const component = mount(
				<Component prop1="ok" prop2={42}/>
			);
			component.unmount();
			
			//Nothing to verify. No throw === success
		});
		
		it('should be called once on mount and have the props as first argument', function() {
			//Prepare
			const spy = sinon.spy();
			const Component = ReactLoader({
				component: FakeComponent,
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
	
	describe('isLoaded', function() {
		it('should have the props as first argument', function() {
			//Prepare
			const spy = sinon.spy();
			const Component = ReactLoader({
				component: FakeComponent,
				isLoaded: spy
			});
			
			//Execute
			mount(
				<Component prop1="ok" prop2={42}/>
			);
			
			//Verify
			expect(spy).to.have.been.calledOnce();
			expect(spy).to.have.been.calledWithExactly({
				prop1: 'ok',
				prop2: 42,
			});
		});
	});
	
	describe('isError', function() {
		it('should have the props as first argument', function() {
			//Prepare
			const spy = sinon.spy();
			const Component = ReactLoader({
				component: FakeComponent,
				isLoaded: spy
			});
			
			//Execute
			mount(
				<Component prop1="ok" prop2={42}/>
			);
			
			//Verify
			expect(spy).to.have.been.calledOnce();
			expect(spy).to.have.been.calledWithExactly({
				prop1: 'ok',
				prop2: 42,
			});
		});
	});
	
	describe('Full worklow', function() {
		it('should render the loading component first, then change to the loaded component after a prop change', function() {
			//Prepare
			const Component = ReactLoader({
				component: (props) => (<div>Loaded</div>),
				loadingComponent: (props) => (<div>Loading</div>),
				errorComponent: (props) => (<div>Error</div>),
				isError: (props) => props.error,
				isLoaded: (props) => props.loaded,
			});
			
			//Execute (1)
			const component = mount(
				<Component prop1="ok" prop2={42} loaded={false}/>
			);
			
			//Verify (1)
			expect(component.html()).to.eq('<div>Loading</div>');
			
			//Execute (2)
			component.setProps({loaded: true});
			
			//Verify (2)
			expect(component.html()).to.eq('<div>Loaded</div>');
			
			//Execute (3)
			component.setProps({loaded: false, error: true});
			
			//Verify (3)
			expect(component.html()).to.eq('<div>Error</div>');
			
			//Execute (3)
			component.setProps({loaded: true, error: true});
			
			//Verify (3)
			expect(component.html()).to.eq('<div>Error</div>');
		})
	});
});
