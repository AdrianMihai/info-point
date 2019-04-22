import React from 'react';

export default class GoogleMap extends React.Component{
	constructor(props){
		super(props);

		this.map = null;
		this.userLocationMarker = null;

		this.state = {
			instituitionMarkers: []
		}

		this.loadedMaps = this.loadedMaps.bind(this);
		this.createInstitutionMarkers = this.createInstitutionMarkers.bind(this);
		this.updateUserLocation = this.updateUserLocation.bind(this);
		this.defineInstitutionCustomMarker = this.defineInstitutionCustomMarker.bind(this);
		this.centerMapToUserLocation = this.centerMapToUserLocation.bind(this);
		this.clickOpenInstitutionTabHandler = this.clickOpenInstitutionTabHandler.bind(this);
	}

	clickOpenInstitutionTabHandler(event) {
		this.props.openInstitutionTab();
		event.preventDefault();
	}

	defineInstitutionCustomMarker() {
		let openInstitutionTabHandler = this.clickOpenInstitutionTabHandler;
		//console.log(openInstitutionTabHandler);

		InstitutionMarkerOverlay.prototype = new google.maps.OverlayView();

		InstitutionMarkerOverlay.prototype.onAdd = function(clickOpenInstitutionTabHandler = openInstitutionTabHandler) {

			let panes = this.getPanes();

			if(!this.infoWindow) {
				let infoWindowContentParent = document.createElement('div');
				infoWindowContentParent.className = 'instMarkerContent';

				let textSpan = document.createElement('span');
				textSpan.setAttribute('style', 'margin: 0px auto; font-weight: 550;');
				textSpan.appendChild(document.createTextNode(this.institutionData.institution.Name));

				let tabParagraph = document.createElement('p'),
					link = document.createElement('a');
				link.appendChild(document.createTextNode('Click to see more!'));
				link.addEventListener('click', openInstitutionTabHandler)
				tabParagraph.appendChild(link);

				//add the elements to the parent
				infoWindowContentParent.appendChild(textSpan);
				infoWindowContentParent.appendChild(tabParagraph);
				
				/*let infoWindowContent = `<div class = "instMarkerContent">
					<span style = "margin: 0px auto; font-weight: 550;"> ${} </span>
					<p> <a href ="" onclick = "this.clickOpenInstitutionTab()"> Click to see more! </a> </p>
					</div>`;*/

				this.infoWindow = new google.maps.InfoWindow({
					content: infoWindowContentParent,
					position: this.latLng
				});
			}

			if (!this.div_) {
				let div = document.createElement('div');
				div.setAttribute('class', 'instMarker');
				div.classList.add('instMarkerAnimation');

				this.div_ = div;
				let self = this;

				panes.overlayMouseTarget.appendChild(this.div_);
				
				google.maps.event.addDomListener(this.div_, "click", function(event) {			
					google.maps.event.trigger(self, "click");
				});

				this.div_.addEventListener('click', (event) => {
					this.infoWindow.open(this.getMap());
					
				});
			}
			
			this.infoWindow.open(this.getMap());
			//console.log("added");
			//panes.overlayLayer.appendChild(this.div_);
		};

		InstitutionMarkerOverlay.prototype.draw = function() {

			let point = this.getProjection().fromLatLngToDivPixel(this.latLng);

			this.div_.style.left = (point.x - (this.div_.clientWidth / 2)) + 'px';
			this.div_.style.top = (point.y - (this.div_.clientHeight / 2)) + 'px';
		};

		InstitutionMarkerOverlay.prototype.onRemove = function() {
  			this.div_.parentNode.removeChild(this.div_);
  			this.infoWindow.close();

  			delete this.div_;
  			delete this.infoWindow;

  			//console.log("removed");
		};

		InstitutionMarkerOverlay.prototype.openInfoWindow = function() {
			this.infoWindow.open(this.getMap());
		}

		InstitutionMarkerOverlay.prototype.closeInfoWindow = function() {
			this.infoWindow.close();
		}
	}

	createInstitutionMarkers(){
		console.log(this.props);
		let markers = [];

		for (let i = 0; i < this.props.institutionData.length; i++) {
			markers.push(new InstitutionMarkerOverlay(
				new google.maps.LatLng(
				{
					lat: this.props.institutionData[i].Latitude,
					lng: this.props.institutionData[i].Longitude
				}),
				this.map,
				{
					'name': this.props.institutionData[i].Name
				}
			));
			break;
		}

		//console.log(markers);
	}

	componentDidMount(){
		let script = document.createElement('script');

		//Filipoiu : AIzaSyA2qWH_SXI2SbE3DBkgzvZVpgtvDV8wDgo
		script.type = "text/javascript";
		script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDe4l2V548M7iNJUm0t1My956bU6dhihBQ';
		script.onload = this.loadedMaps;
		script.setAttribute('async', true);
		script.setAttribute('defer', true);

		document.body.appendChild(script);
	}

	centerMapToUserLocation(event) {
		if(this.userLocationMarker.getMap() && this.userLocationMarker.getPosition()) {
			this.map.panTo(this.userLocationMarker.getPosition());
		}
	}

	updateUserLocation(pos) {
		
		let newPosition = new google.maps.LatLng(
				{
					lat: pos.coords.latitude,
					lng: pos.coords.longitude
				}
		);

		if(!this.userLocationMarker.getMap()) {
			this.userLocationMarker.setMap(this.map);
			this.map.panTo(newPosition);

		}
		
		this.userLocationMarker.setPosition(newPosition);
	}

	loadedMaps(){
		console.log("Loaded Google maps!");

        this.map = new google.maps.Map(document.getElementById("map"), {
        	center: {lat: 10.794234, lng: 106.706541},
          	zoom: 20,
          	mapTypeId: google.maps.MapTypeId.SATELITE,
          	mapTypeControl: true,
    	   	mapTypeControlOptions: {
      			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      			position: google.maps.ControlPosition.BOTTOM_CENTER
  			},
  			zoomControl: true,
  			zoomControlOptions: {
      			position: google.maps.ControlPosition.RIGHT_CENTER
  			},
  			fullscreenControl: false
        });

        let image = {
		    url: 'public/img/client2.png',
		    scaledSize: new google.maps.Size(32, 32),
		    origin: new google.maps.Point(0, 0),
		    anchor: new google.maps.Point(16, 32)
		};

		this.userLocationMarker = new google.maps.Marker({
        	title: 'You are here!',
        	icon: image
		});
 
        if (navigator.geolocation) {
        	navigator.geolocation.watchPosition(
        		this.updateUserLocation,
    			() => {
            		console.log('navigator disabled');
          		},
          		{
          			enableHighAccuracy: true,
          			maximumAge: 20000
          		}
          	);
        } else {
          // Browser doesn't support Geolocation
          console.log('navigator disabled');
        }

        this.defineInstitutionCustomMarker();
		this.props.shareMapInstance(this.map);
	}

  	render(){
	  	let loader = <div></div>;
	  	let currentPositionButton = <React.Fragment/>;

	  	if( !this.map) {
	    	loader = <div className = "mdl-spinner mdl-js-spinner is-active"></div>
	    }
	    else {
	    	currentPositionButton = (
	    		<div className = "currentPositionButton" onClick = {this.centerMapToUserLocation}>
    				<i className = "material-icons">my_location</i>
				</div>
			);
	    }

	    return (    
	    	<div>
	      		<div ref="map" id = "map" style={{height: '100%', width: '100%', position: 'absolute'}}> </div>
	      		{loader}
	      		{currentPositionButton}
	    	</div>
	    )
	}

	componentDidUpdate() {
		if (this.map) {

		}
	}
}