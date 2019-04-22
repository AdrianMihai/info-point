import React from 'react';

export default class Sidebar extends React.Component {
	constructor(props) {
		super(props);

		this.fbLoginClickHandler = this.fbLoginClickHandler.bind(this);
	}

	fbLoginClickHandler(event) {

		if (typeof FB === 'object' && this.props.userData === null) {
			FB.login((response) => {
				if (response.status === 'connected') {
					console.log(response);
				}
				else {
					console.log("User cancelled login dialog!");
				}
			});
		}
	}

	componentDidMount() {

	}

	render() {
		return (
			<div className = "mdl-layout__drawer">
	        	<span className = "mdl-layout-title"> Menu </span>
	            	<div className = "mdl-grid">
	            		<div className = "mdl-cell--12-col">
	            			<button 
	            				type = "button"
	            				className = "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent fb-login-button"
	            				onClick = {this.fbLoginClickHandler}
	            			>
	            				<span> Facebook Login </span>
	            			</button>
	            		</div>
	            	</div>
	    	</div>
    	);
	}
}