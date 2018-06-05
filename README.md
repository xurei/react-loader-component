# react-loader-component

A React Higher Order Component that triggers some Promise on mount and display a loading component until the Promise has finished.

[![npm](https://img.shields.io/npm/v/react-loader-component.svg)](https://www.npmjs.com/package/react-loader-component)
[![wercker status](https://app.wercker.com/status/c154a6be090561352ba4a13b6090fcf2/s/master "wercker status")](https://app.wercker.com/project/byKey/c154a6be090561352ba4a13b6090fcf2)
[![Codecov](https://img.shields.io/codecov/c/github/xurei/react-loader-component.svg)](https://codecov.io/gh/xurei/react-loader-component)
[![GitHub issues](https://img.shields.io/github/issues/xurei/react-loader-component.svg)](https://github.com/xurei/react-loader-component/issues)
[![Codacy grade](https://img.shields.io/codacy/grade/97487e86a6644e8fb0f64cf4c2637ee1.svg)](https://www.codacy.com/app/xurei/react-loader-component)

## Usage
```javascript
const ReactLoader = require('react-loader-component');

const MyComponent = ReactLoader({
    component: (props) => (<p>Hello World</p>),
    loadingComponent: props => (<p>Loading</p>),
    errorComponent: props => (<p>There was an error</p>),
    load: (props) => {
        //Do some async loading here
        //Return a Promise
    },
});
```

## API

### `ReactLoader(options)`
- `options` : Object
  - `component` **required** : 
  
    component to render when the state of the store matches `isLoaded`.
    The props passed to the loader are forwarded to the component.
    
  - `errorComponent` : 
  
    component to render when the state of the store matches `isError`.
    The props passed to the loader are forwarded to the error component.
    
    Default: `() => (<div>Impossible to fetch the data requested.</div>)`
    
  - `loadingComponent` : 
  
    component to render when the state of the store does not match `isError` nor `isLoading` (typically, the "loading" state).
    The props passed to the loader are forwarded to the error component.
    
    Default: `() => (<div>Loading...</div>)`
    
  - `load(props)` **required** : 
    
    function called to load whatever you need. It must return a `Promise`.
    
  - `shouldComponentReload(props, nextProps)` : 
  
    Should return `true` if the loader should reload the data, i.e. if `load()` has to be called again.
    
    Default: returns `true` iff the props have changed.
    
  - `componentWillUnmount(props)` : 
  
    Same behavior as the React functions of the same name. Can be used to clean up your store.
    
  - `resultProp` : 
  
    Name of the prop where the result of `load()` will be set. Default: `"data"`
    
    
### Minimal example
```javascript
const React = require('react');
const ReactDOM = require('react-dom');
const ReactLoader = require('react-loader-component');

//The pure component
const MyPureComponent = (props) => (
    <div>Content loaded: {JSON.stringify(props)}</div>
);

//It gets wrapper around the ReactLoader
let MyComponent = ReactLoader({
    component: MyPureComponent,
    errorComponent: (props) => (<div>An error occured : {JSON.stringify(props.data)}</div>),
    loadingComponent: () => (<div>Loading. Content takes 2s to load</div>),
    load: (props) => {
        //Faking an async call by waiting 2 seconds
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(42), 2000)
        });
    },
});

//Render the app as usual
ReactDOM.render((
    <MyComponent/>
), document.getElementById('app'));
```
