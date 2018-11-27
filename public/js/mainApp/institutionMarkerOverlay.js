function InstitutionMarkerOverlay(latLng, map, institutionData) {
	this.latLng = latLng;
	this.institutionData = institutionData;
	this.div_ = null;
	this.infoWindow = null;

	this.setMap(map);
}