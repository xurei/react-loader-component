# react-loader-component

A React Higher Order Component that triggers some Promise on mount and display a loading component until the Promise has finished.

[![npm](https://img.shields.io/npm/v/react-loader-component.svg)](https://www.npmjs.com/package/react-loader-component)
[![wercker status](https://app.wercker.com/status/c154a6be090561352ba4a13b6090fcf2/s/master "wercker status")](https://app.wercker.com/project/byKey/c154a6be090561352ba4a13b6090fcf2)
[![Codecov](https://img.shields.io/codecov/c/github/xurei/react-loader-component.svg)](https://codecov.io/gh/xurei/react-loader-component)
[![GitHub issues](https://img.shields.io/github/issues/xurei/react-loader-component.svg)](https://github.com/xurei/react-loader-component/issues)
[![Codacy grade](https://img.shields.io/codacy/grade/97487e86a6644e8fb0f64cf4c2637ee1.svg)](https://www.codacy.com/app/xurei/react-loader-component)

[![Sponsor](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&link=<url>)](https://github.com/sponsors/xurei)

[Demo](https://react-loader-component.vercel.app)

## Usage
```jsx
import ReactLoader from 'react-loader-component';

const MyComponent = ReactLoader({
    loadingComponent: props => (<p>Loading</p>),
    errorComponent: props => (<p>There was an error: {JSON.stringify(props.data)}</p>),
    load: (props) => {
        //Do some async loading here
        //Return a Promise
    },
})((props) => (<p>Data: {JSON.stringify(props.data)}</p>));
```

### As a decorator
You need [@babel/plugin-proposal-decorators](https://babeljs.io/docs/en/next/babel-plugin-proposal-decorators.html) for this to work.

```jsx
import ReactLoader from 'react-loader-component';

@ReactLoader({
    loadingComponent: props => (<p>Loading</p>),
    errorComponent: props => (<p>There was an error</p>),
    load: (props) => {
        //Do some async loading here
        //Return a Promise
    },
})
class MyComponent {
    render() {
        return (
            <p>Hello World</p>
        );
    }
};
```

## Advanced usage
This component is meant to be extendable based on your context. 
You should wrap the call to `ReactLoader` in a fucntion of your own. 

Here is an example:
```jsx
function MyLoader(myoptions) {
    return ReactLoader({
        errorComponent: MyErrorComponent,
        loadingComponent: MyLoadingView,
        resultProp: 'loaderData',
        shouldComponentReload: myoptions.shouldComponentReload || ((props, nextProps) => !deepEqual(props, nextProps)),
        load: function myLoadFunction() {
            // Fetch some data based on myoptions
            return Promise.resolve(fetchedData);
        }, 
    });
}

@MyLoader({
    type: 'user',
    id: 42,
})
class MyComponent {
    render() {
        return (
            <p>Hello World</p>
        );
    }
};

const MyOtherComponent = MyLoader({
    type: 'user',
    id: 42,
})((props) => {
    return (
        <p>Hello World</p>
    );
})
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
    
## Support Open-Source
Support my work on https://github.com/sponsors/xurei
