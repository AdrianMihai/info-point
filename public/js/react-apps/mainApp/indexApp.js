import React from 'react';
import ReactDOM from 'react-dom';
import GoogleMap from './Map';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import InstitutionTab from './InstitutionTab';

class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			instDataHasLoaded: false,
			googleMap: null,
			openInstitutionTab: null,
			userData: null
		};

		this.lastClickedActionInstitutionMarker = null;

		this.institutionData = {};
		this.getGoogleMapInstance = this.getGoogleMapInstance.bind(this);
		this.getInstitutionTabOpener = this.getInstitutionTabOpener.bind(this);
		this.getInstitutionByActionId = this.getInstitutionByActionId.bind(this);
		this.searchInstitutionClickHandler = this.searchInstitutionClickHandler.bind(this);
		this.getSelectedInstitutionData = this.getSelectedInstitutionData.bind(this);
		this.searchActionById = this.searchActionById.bind(this);
		this.loadedFbApi = this.loadedFbApi.bind(this);
	}

	//Searches an action by a given id in a given list of actions of an institution
	//In: actionId (integer)
	//Out:object containing data about the action
	//    null - if no action is found	
	searchActionById(actionsList, actionId) {
		const filterResult = actionsList.filter((action) => {return action.Id === actionId});
		
		return filterResult.length === 0 ? null : filterResult[0];
	}

	//Searches an institution action by a given id.
	//In: actionId (integer)
	//Out: object containing data about the institution where the action can be done
	//		null - if no action is found
	getInstitutionByActionId(actionId) {
		let result = null;

		for (let i = 0; i < this.institutionData.length; i++) {
			
			let filterResult = this.institutionData[i].actions.filter(action => action.Id === actionId);
			
			if (filterResult.length === 1) {
				result = {
					institution: this.institutionData[i],
					selectedActionData: filterResult[0]
				};
				break;
			}
		}

		return result;
	}

	//Receives the google map instance from the GoogleMap component and updates the state.
	//Input: map(Instance of the google map object)
	//Output: None
	getGoogleMapInstance(map) {
		this.setState({googleMap: map});
	}

	getInstitutionTabOpener(opener) {
		this.openInstitutionTab = opener;
	}

	searchInstitutionClickHandler(actionId) {
		let selectedInstitution = this.getInstitutionByActionId(actionId);

		if (this.lastClickedActionInstitutionMarker) {
			this.lastClickedActionInstitutionMarker.setMap(null);
		}

		this.lastClickedActionInstitutionMarker = new InstitutionMarkerOverlay(
			new google.maps.LatLng(
				{
					lat: selectedInstitution.institution.Latitude,
					lng: selectedInstitution.institution.Longitude
				}),
				this.state.googleMap,
				selectedInstitution
		);
		
		this.state.googleMap.panTo(this.lastClickedActionInstitutionMarker.latLng);
		
	}

	getSelectedInstitutionData() {
		if (!this.lastClickedActionInstitutionMarker) {
			return null;
		}

		return this.lastClickedActionInstitutionMarker.institutionData;
	}

	loadedFbApi() {
		FB.init({
	        appId      : '811149522573745',
	        cookie     : true,
	        xfbml      : true,
	        version    : 'v3.3'
    	});

    	FB.getLoginStatus((response) => {
    
    		console.log(response);

    		/*if (response.status === 'connected') {
    			FB.api('/' + response.authResponse.userID.toString(),
    			 {fields: ['first_name', 'last_name', 'email', 'picture']},
    			 (resp) => {
    				console.log(resp);
    				this.props.userData.updateUserData(resp, 'facebook', response.status);

    			});
    		}
    		else {
    			this.props.userData.updateUserData({}, 'facebook', response.status);
    		}
    		*/
		});
	}

	componentDidMount(){
		fetch("getInstitutions")
		.then(res => res.json())
		.then((data) => {
			//console.log(data);
			this.institutionData = data;
			this.setState({
				'instDataHasLoaded': true
			});
		})
		.catch((error) => {
			console.log(error);
		});

		//load the facebook sdk
		let js, fjs = document.getElementsByTagName('script')[0];
	    if (!document.getElementById('facebook-jssdk')){
	    	js = document.createElement('script');
	    	js.id = 'facebook-jssdk';
		    js.src = "https://connect.facebook.net/en_US/sdk.js";
		    js.onload = this.loadedFbApi;
		    fjs.parentNode.insertBefore(js, fjs);
	    }
		
	}

	render() {
		return (
			<React.Fragment>
				<div className = "mdl-layout mdl-js-layout mdl-layout--fixed-header">
			         
         			<Navbar
         				institutionData = {this.state.instDataHasLoaded === true ? (this.institutionData) : []}
         				institutionClickHandler = { this.searchInstitutionClickHandler }
     				/>
  					
  					<Sidebar userData = {this.state.userData} />

  					<InstitutionTab 
  						shareTabOpener = {this.getInstitutionTabOpener}
  						getSelectedInstitution = {this.getSelectedInstitutionData}
  						searchActionById = {this.searchActionById}
  					/>
  					
		        	<main className = "mdl-layout__content">
		            	<GoogleMap 
		            		institutionData = {this.state.instDataHasLoaded === true ? (this.institutionData) : []}
		            		shareMapInstance = {this.getGoogleMapInstance}
		            		openInstitutionTab = {this.openInstitutionTab}
	            		/>

		        	</main>
      			</div>
			</React.Fragment>
		);
	}

	componentDidUpdate() {
		//console.log("updated");

		if (this.state.instDataHasLoaded === true){

			console.log(this.institutionData);
		}
	}
}

ReactDOM.render(<App />, document.getElementById("react"));