# redux-loader-component

A React higher order component that dispatches actions and renders loading/error states

## Usage
```javascript
const ReduxLoader = require('redux-loader-component');
const reduxActions = require('./my-redux-actions');
const store = require('./my-redux-store');

class MyPureComponent extends React.Component {
    /* ... */
}

MyPureComponent = ReduxLoader({
    component: MyPureComponent,
    componentDidMount: (props) => {
        store.dispatch(reduxActions.myAction(props.some_data));
    },
    isLoaded: (props) => props.challenges && !props.challenges.loading && !!props.challenges.sync,
    isError: (props) => props.challenges && !!props.challenges.error
});
```

### API

#### `ReduxLoader(options)`
- `options` : Object
  - `component` : 
  
    *required* component to render when the state of the store matches `isLoaded`
    
  - `errorComponent` : 
  
    component to render when the state of the store matches `isError`
    
  - `loadingComponent` : 
  
    component to render when the state of the store does not match `isError` nor `isLoading`
    
  - `componentDidMount(props)` : 
  
    function called when the loader is mounted. Typically the place where you put you `dispatch()` methods.
    
  - `componentWillUnmount(props)` : 
  
    function called when the loader is unmounted. Can be used to clean up your store.
    
  - `isLoaded(props)` : 
  
    defines the condition on the props to render the `component`
    
  - `isError(props)` : 
  
    defines the condition on the props to render the `errorComponent`
    
    
### Examples

#### With [redux-api](https://www.npmjs.com/package/redux-api)
```javascript
const LoadingView = require('./my-loading-view');
MyComponent = ReduxLoader({
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

#### Wrap it for easier use !
If you plan to use this component for a big project, I suggest you create a wrapper around it, 
to simplify the component for you use case. 

You can find an example using [redux-api](https://www.npmjs.com/package/redux-api) in [examples/wrapper-redux-api.js](examples/wrapper-redux-api.js).

Using this example, you can call the loader like this :
```javascript
const ReduxLoader = require('redux-loader-component');
const reduxActions = require('./my-redux-actions');
const store = require('./my-redux-store');
const ReduxApiLoader = require('./redux-api-loader-component');

class MyPureComponent extends React.Component {
    /* ... */
}

MyPureComponent = ReduxApiLoader({
    component: MyPureComponent,
    errorComponent: () => (<div>Oh no ! There was an error :-(</div>),
    stores: [ 
        'rest_endpoint_1',  
        'rest_endpoint_2'
    ]
});
```