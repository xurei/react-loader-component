## 2.0.1 - 2021-08-02
- Dependencies update : deep-eql@4.0.0, is-promise@4.0.0, react 17 accepted 

## 2.0.0 - 2020-10-06
BREAKING CHANGES
- Working with promises
- Support for legacy and stage-2 JS decorators
- Removed `componentWillMount` and `componentWillUpdate`, not compatible with React 17
- Removed `component` option and reformatted API as `ReactLoader(options)(Component)` 
- Add `errorProp`; default to "error"

## 1.1.2 - 2018-06-04
- Dependencies update

## 1.1.1 - 2017-07-11
- Replaced `componentDidMount()` by `componentWillMount()` for server rendering

## 1.1.0 - 2017-08-18
- First stable version
- Changed `componentDidMount()` to `componentWillUpdate()`
