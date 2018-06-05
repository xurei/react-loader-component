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
    componentWillMount: (props) => {
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
    
  - `componentWillMount(props)`/`componentWillUpdate(props)` : 
  
    Same behavior as the React functions of the same name. Typically the place where you put your asynchronous calls.
    
  - `componentWillUnmount(props)` : 
  
    function called when the component is unmounted. Can be used to clean up your store.
    
  - `isLoaded(props)` : 
  
    defines the condition on the props to render the `component`.
    
  - `isError(props)` : 
  
    defines the condition on the props to render the `errorComponent`.
    
    
### Full example with `react-redux`
```javascript
const React = require('react');
const ReactDOM = require('react-dom');
const redux = require('redux');
const ReactRedux = require('react-redux');
const ReactLoader = require('react-loader-component');

//Some redux boilerplate here
const payload = (state=null, action) => {
    switch (action.type) {
        case 'SET':
            return action.data;
    }
    return state;
};
const store = redux.createStore(redux.combineReducers({payload}));

//A fake service simulating an async call
const MyService = {
    asyncCall() {
        //Simulating async call with setTimeout
        setTimeout(() => {
            store.dispatch({type:'SET', data:'It works!'});
        }, 3000);
    }
};

//The pure component
const MyPureComponent = (props) => (
    <div>Content loaded</div>
);

//It gets wrapper around the ReactLoader
let MyComponent = ReactLoader({
    component: MyPureComponent,
    errorComponent: (props) => (<div>An error occured : {JSON.stringify(props.rest_endpoint.error)}</div>),
    loadingComponent: (props) => (<div>Loading. Content takes 3s to load</div>),
    componentWillMount: () => {
        MyService.asyncCall();
    },
    isLoaded: (props) => props.payload !== null,
    isError: (props) => false
});

//Connect to the Redux store
//It is important to do that AFTER having wrapped the component with ReactLoader.
MyComponent = ReactRedux.connect(
    state => ({
        payload: state.payload,
    }),
    dispatch => ({
    })
)(MyComponent);

//Render the app as usual
const Provider = ReactRedux.Provider;
ReactDOM.render((
    <Provider store={store}>
        <MyComponent/>
    </Provider>
), document.getElementById('app'));
```
