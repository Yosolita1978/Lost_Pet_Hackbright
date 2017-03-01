import React from 'react';
import ReactDOM from 'react-dom';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";

import LostPet from "./LostPet";


//this create a GoogleMap variable/component

var LostPetsGoogleMap = withGoogleMap(function(props) {
    
    var markers = [];
    var pet, position;
    var infoWindow;

    function makeClickHandler(pet){
        return function(){ props.onMarkerClick(pet) };
    }

    for (var i = 0; i < props.pets.length; i++){
        pet = props.pets[i];

        position = new google.maps.LatLng(pet.latitude, pet.longitude);

        if (pet === props.selected_pet){
            infoWindow = (
                <InfoWindow onCloseClick={props.onMarkerClose}>
                    <div className="info-window">
                    <LostPet lostPet={pet} />
                    </div>
                </InfoWindow>
            );
        } else {
            infoWindow = null;
        }

        markers.push(
            <Marker key={pet.lostpet_id}
                    position = {position}
                    onClick={ makeClickHandler(pet) }>
                    { infoWindow }
            </Marker>
        );
    }

    return (
        <GoogleMap
            ref={props.onMapLoad}
            defaultZoom={12}
            defaultCenter={{ lat: 37.773, lng: -122.431 }}>
            
            { markers }

        </GoogleMap>
    );
});

//This component pass the lostpet list component to the GoogleMaps component to use that information

export default class LostPetsMap extends React.Component{
    constructor(props){
        super(props);
        this.state = {selected_pet: null};
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMarkerClose = this.onMarkerClose.bind(this);
    }

    onMarkerClick(pet){
        //console.log(pet)
        this.setState({selected_pet: pet});
    }

    onMarkerClose(){
        this.setState({selected_pet: null});
    }

    render(){
        return (
            <LostPetsGoogleMap 
                containerElement={
                    <div style={{ height: '100%' }} />
                }
                mapElement={
                    <div style={{ height: '400px' }} />
                }
                onMarkerClick={this.onMarkerClick}
                onMarkerClose={this.onMarkerClose}
                pets = {this.props.pets}
                selected_pet={this.state.selected_pet}/>
        );
    }
}