import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export default class Navbar extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			searchActionValue: ""
		}
		this.actionSearchHandler = this.actionSearchHandler.bind(this);
		this.clearButtonClickHandler = this.clearButtonClickHandler.bind(this);
		this.filterActionsByName = this.filterActionsByName.bind(this);
		this.formSubmitHandler = this.formSubmitHandler.bind(this);
	}

	actionSearchHandler(event) {

		if (this.props.institutionData.length > 0) {
			this.setState({
				searchActionValue: event.target.value
			});
		}
	}

	clearButtonClickHandler(event) {
		if (this.state.searchActionValue.length > 0) {
			this.setState({
				searchActionValue: ""
			});
		}
	}

	formSubmitHandler(event) {
		event.preventDefault();

	}

	filterActionsByName() {
		let result = [];
		this.props.institutionData.filter((inst) => {
			result.push({'id': inst.Id, 'actions': []});
			inst.actions.filter((action) => {
				//make a case insensitive matching
				if (action.Name.toLowerCase().match(new RegExp(this.state.searchActionValue.toLowerCase()))) {
					result[result.length - 1]['actions'].push(action);
				}
			});

			//if no actions are found, delete the record in the array
			if (result[result.length - 1]['actions'].length == 0) {
				result.splice(result.length - 1, 1);
			}
		});

		return result;
	}

	render() {
		let filterResult = [],
		actionsDropdown;

		if (this.state.searchActionValue.length > 0) {
			let instActions = this.filterActionsByName();

			for (let i = 0; i < instActions.length; i++) {
				instActions[i].actions.map((action, i) => {
					//console.log(action);
					filterResult.push(

						<li className="mdl-list__item"
							key = {'action_' + action.Id}
							onClick = { () => {this.props.institutionClickHandler(action.Id)}}
						>
					    	<span className="mdl-list__item-primary-content">
					    		{action.Name}
					    	</span>
					  	</li>
					);
				});
			}
			
			if (filterResult.length == 0) {
				actionsDropdown = (
					<ul className="mdl-list"  key = "dropdown-list">
					    <p style = {{textAlign: 'center', margin: '0px'}} key = "dropdown-message"> No actions found! </p>
					</ul>
				);
			}
			else {
				actionsDropdown = (
					<ul className="mdl-list"  key = "dropdown-list">
					    {filterResult}
					</ul>
				);
			}
		}		
		
		return (
			<header className = "mdl-layout__header navbar">
	            <div className = "mdl-layout__header-row">
	               
					<form className = "searchActionForm mdl-cell--6-col mdl-cell--4-col-phone" action="#" onSubmit = {this.formSubmitHandler}>
							<div className="mdl-textfield mdl-js-textfield">
								<input 
									className = "mdl-textfield__input searchInput"
									type = "text"
									id = "searchAction"
									autoComplete = "off"
									placeholder = "Search... (Ex: Eliberare buletin)"
									value = {this.state.searchActionValue}
									onChange = {this.actionSearchHandler}

								/>
								

								<label 
									className ="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon clearButton"
									onClick = {this.clearButtonClickHandler}
								>
      								<i className ="material-icons">clear</i>
    							</label>

    							<CSSTransition 
    								classNames = "filter-dropdown"
    								timeout = {400}
    								in = {this.state.searchActionValue.length != 0}
    							>
    								<div className = "filter-dropdown">
										{actionsDropdown}
									</div>
    								
    							</CSSTransition>
							</div>
					</form>
	            </div>
	        </header>
		);
	}

	componentDidMount() {
	
	}

	componentDidUpdate(props) {
	}
}