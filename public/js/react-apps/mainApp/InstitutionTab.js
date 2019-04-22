import React from 'react';
import { CSSTransition } from 'react-transition-group';
import ActionSteps from './ActionSteps';

export default class InstitutionTab extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
			selectedInstitution: null,
			selectedAction: null
		};


		this.openTab = this.openTab.bind(this);
		this.closeTab = this.closeTab.bind(this);
		this.clickActionHandler = this.clickActionHandler.bind(this);
		this.switchToActionsList = this.switchToActionsList.bind(this);
	}

	clickActionHandler(actionId) {
		this.setState({
			selectedAction: this.props.searchActionById(this.state.selectedInstitution.institution.actions, actionId)
		});
	}

	openTab() {
		this.setState({
			isOpen: true,
			selectedInstitution: this.props.getSelectedInstitution()
		});
	}

	closeTab() {
		this.setState({
			isOpen: false,
			selectedInstitution: null,
			selectedAction: null
		});
	}
	
	switchToActionsList() {
		this.setState({selectedAction: null});
	}

	componentDidMount() {
		this.props.shareTabOpener(this.openTab);
	}

	render() {
		let actions = null, actionsHeader = null;

		if (!this.state.selectedInstitution) {
			actions = [];
			actionsHeader = <h5> No Possible Actions </h5>;
		}
		else {
			actionsHeader = <h5> Possible Actions: </h5>;
			actions = this.state.selectedInstitution.institution.actions.map((action) => {
				return (
					<li 
						className = "mdl-list__item"
						key = {"action" + action.Id}
						onClick = { (event) => {this.clickActionHandler(action.Id); }}
					>
						<span className = "mdl-list__item-primary-content">
							<i className = "material-icons mdl-list__item-icon">description</i>
							{action.Name}
						</span>
					</li>
				);
			}); 
		}
		
		return (
			<CSSTransition 
				in = {this.state.isOpen}
				classNames = 'institution-tab'
				timeout = {400}
			>
				<div className = 'institution-tab mdl-cell--5-col mdl-cell--6-col-tablet mdl-cell--4-col-phone'>
					<div className = "mdl-grid">
						<div className = "mdl-cell mdl-cell--10-col mdl-cell--6-col-tablet mdl-cell--3-col-phone">
							<h4 style = {{margin: '0px' }}>
								{!this.state.selectedInstitution ? 'Institution Name' : this.state.selectedInstitution.institution.Name}
							</h4>
						</div>
						<div className = "mdl-cell mdl-cell--2-col mdl-cell--2-col-tablet mdl-cell--1-col-phone">
							<i 
								className ="material-icons close-button"
								onClick = { (event) => {this.closeTab(); } }
							>
								close
							</i>

						</div>
					</div>

					<CSSTransition
						in = {this.state.selectedInstitution && !this.state.selectedAction}
						classNames = 'actions-list-container'
						timeout = {300}
					>
						<div className = "mdl-grid actions-list-container">
							<div className = "mdl-cell mdl-cell--12-col">
								{actionsHeader}
							</div>
							<div className = "mdl-cell mdl-cell--12-col">
								<ul className = "mdl-list">
									{actions}
								</ul>
								
							</div>
							
						</div>
					</CSSTransition>

					<ActionSteps 
						isOpen = {this.state.selectedInstitution !== null && this.state.selectedAction !== null}
						selectedAction = {this.state.selectedAction}
						switchToActionsList = {this.switchToActionsList}
					/>
					
				</div>
			</CSSTransition>
		);
		
	}

	componentDidUpdate(prevProps) {
		//console.log(this.state);
	}
}