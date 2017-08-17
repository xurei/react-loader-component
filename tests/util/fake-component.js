const React = require('react'); //eslint-disable-line no-unused-vars

class FakeComponentClass extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stateVal: 0,
		};
	}
	
	render() {
		return (
			<div style={this.props.style || {}}>Fake Component {this.props.val}</div>
		);
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		return JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState);
	}
}
FakeComponentClass.propTypes = {};
FakeComponentClass.displayName = 'FakeComponent';

module.exports = FakeComponentClass;
