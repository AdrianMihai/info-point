import React from 'react';
import { CSSTransition } from 'react-transition-group';
import ActionStep from './action_steps/ActionStep';

export default class ActionSteps extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			currentInstructionIndex: 0 
		}
	}
	

	componentDidMount() {
		console.log(this.props.selectedAction);
	}

	render() {
		let dots = [],
			dotsLeftDistance = 0,
			instructions = [];
		
		if (this.props.selectedAction) {

			dots = this.props.selectedAction.instructions.map((el, i) => {
				let classNames = "dot";

				if (i <= this.state.currentInstructionIndex) {
					classNames += " marked-dot"
				}
				return <div key = {el.Id} className = {classNames}></div>
			});
			
			const pxOffset = (12 * dots.length + 4 * (dots.length - 1)) / 2;
			dotsLeftDistance = 'calc(50% - ' + pxOffset.toString() + "px)";
		}

		return (
			<React.Fragment>
				<CSSTransition 
					in = {this.props.isOpen === null ? false : this.props.isOpen}
					classNames = "action-steps-container"
					timeout = {300}
				>
					<div className = "mdl-grid action-steps-container">
						<div className = "mdl-cell mdl-cell--2-col mdl-cell--1-col-tablet mdl-cell--1-col-phone">
							<i 
								className ="material-icons back-button"
								onClick = { (event) => {this.props.switchToActionsList(); } }
							>
								arrow_back_ios
							</i>
						</div>

						<div className = "mdl-cell mdl-cell--10-col mdl-cell--7-col-tablet mdl-cell--3-col-phone">
							<h5 className = "instruction-name">Instruction Name</h5>
						</div>
						
						<div 
							className = "progress-bar"
							style = {{'left': dotsLeftDistance}}
						>
							{dots}
						</div>

					</div>
				</CSSTransition>
			</React.Fragment>
		);
	}
		

	componentDidUpdate(prevProps) {
		console.log(this.props);
		//console.log(prevProps, this.props);
	}
}