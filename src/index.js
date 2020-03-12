import React from "react";
import ReactDom from "react-dom";
const root = document.getElementById("root");

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			data: [],
			loading: true
		};
	}

	render() {
		const { data, loading } = this.state;
		return <div>hi</div>;
	}
}

ReactDom.render(<App />, root);
