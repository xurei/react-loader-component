# react-loader-component

A React higher order component that dispatches actions and renders loading/error states

[![npm](https://img.shields.io/npm/v/react-loader-component.svg)](https://www.npmjs.com/package/react-loader-component)
[![wercker status](https://app.wercker.com/status/c154a6be090561352ba4a13b6090fcf2/s/master "wercker status")](https://app.wercker.com/project/byKey/c154a6be090561352ba4a13b6090fcf2)
[![Codecov](https://img.shields.io/codecov/c/github/xurei/react-loader-component.svg)](https://codecov.io/gh/xurei/react-loader-component)
[![GitHub issues](https://img.shields.io/github/issues/xurei/react-loader-component.svg)](https://github.com/xurei/react-loader-component/issues)
[![Codacy grade](https://img.shields.io/codacy/grade/97487e86a6644e8fb0f64cf4c2637ee1.svg)](https://www.codacy.com/app/xurei/react-loader-component)

## Usage
```javascript
const ReactLoader = require('react-loader-component');
const reduxActions = require('./my-redux-actions');
const store = require('./my-redux-store');

class MyPureComponent extends React.Component {
    /* ... */
}

MyPureComponent = ReactLoader({
    component: MyPureComponent,
    componentDidMount: (props) => {
        store.dispatch(reduxActions.myAction(props.some_data));
    },
    isLoaded: (props) => props.some_data && !props.some_data.loading && !!props.some_data.sync,
    isError: (props) => props.some_data && !!props.some_data.error
});
```

### Wrap it for easier use !
If you plan to use this component for a big project, I suggest you create a wrapper around it, 
to simplify the component for your use case. 

You can find an example using [redux-api](https://www.npmjs.com/package/redux-api) in [examples/react-loader-redux-api.js](examples/react-loader-redux-api.js).

## API

### `ReactLoader(options)`
- `options` : Object
  - `component` **required** : 
  
    component to render when the state of the store matches `isLoaded`.
    The props passed to the loader are forwarded to the component.
    
  - `errorComponent` : 
  
    component to render when the state of the store matches `isError`.
    The props passed to the loader are forwarded to the error component.
    
  - `loadingComponent` : 
  
    component to render when the state of the store does not match `isError` nor `isLoading` (typically, the "loading" state).
    The props passed to the loader are forwarded to the error component.
    
  - `componentWillUpdate(props)` : 
  
    function called when the component is mounted or has updated its props. Typically the place where you put your `dispatch()` methods in a Redux environment.
    
  - `componentWillUnmount(props)` : 
  
    function called when the component is unmounted. Can be used to clean up your store.
    
  - `isLoaded(props)` : 
  
    defines the condition on the props to render the `component`.
    
  - `isError(props)` : 
  
    defines the condition on the props to render the `errorComponent`.
    
    
## Examples

### With [redux-api](https://www.npmjs.com/package/redux-api)
```javascript
const LoadingView = require('./my-loading-view');
MyComponent = ReactLoader({
    component: MyComponent,
    errorComponent: (props) => (<div>An error occured : {JSON.stringify(props.rest_endpoint.error)}</div>),
    loadingComponent: LoadingView,
    componentDidMount: () => {
        store.dispatch(store.actions.rest_endpoint());
    },
    isLoaded: (props) => props.rest_endpoint && !props.rest_endpoint.loading && !!props.rest_endpoint.sync,
    isError: (props) => props.rest_endpoint && !!props.rest_endpoint.error
});
```
