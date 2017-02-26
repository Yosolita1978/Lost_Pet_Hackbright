import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { Button, Modal, Navbar, NavItem, Nav } from 'react-bootstrap';
import DropzoneComponent from 'react-dropzone-component';
import Dropzone from 'react-dropzone';
import request from 'superagent';


import LostPetList from "./components/LostPetList";
import LostPetFilters from "./components/LostPetFilters";
import LostPetsMap from "./components/LostPetsMap";
import NavbarInstance from "./components/NavbarInstance";


//In this place are the additional functions that I need just for create urls and others strings

function encodeQueryData(data) {
    var ret = [];
    Object.keys(data).forEach(function(d) {
        if (!!data[d]){
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        }
    });
    return ret.join('&');
}


//This component is the App component of all the others, except the navbar

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            species: [],
            pets: [] 
        };
        this.getResults = this.getResults.bind(this);
        this.postFormValues = this.postFormValues.bind(this);
    }

    componentDidMount(){
        var self = this;
        fetch('http://127.0.0.1:5000/lostpets/api/species').then(function (response){
            return response.json();
        }).then(function (data) {
            self.setState({species: data});
        });
    }

    getResults(params){
        var self = this;
        var geocoder = new google.maps.Geocoder();
        var url = 'http://127.0.0.1:5000/lostpets/api/lostpets.json?';
        //var params = {text_search: this.text_search, species_code: this.selected_species}
        url += encodeQueryData(params)

        fetch(url).then(function (response){
            return response.json();
        }).then(function (data) {
            
            for (var i = 0; i < data.result.length; i++){
                let pet = data.result[i];
                if ((!pet.latitude || !pet.longitude) && !!pet.address){
                    geocoder.geocode({address: pet.address}, function askGeocode(results, status){
                        if(status === google.maps.GeocoderStatus.OK){
                            var position = results[0].geometry.location;
                            pet.latitude = position.lat();
                            pet.longitude= position.lng();
                            self.setState({pets: self.state.pets});
                        }   
                    });
                }
            }
            self.setState({pets: data.result});
        });



    }

    postFormValues(formfilters){
        var self = this;
        console.log("Those are the formfilters", formfilters);
        var newname = formfilters.namePet;
        var species = formfilters.species;
        var title = formfilters.title;
        var gender = formfilters.gender;
        var description = formfilters.description;
        var address = formfilters.address;
        var email = formfilters.email;
        var phone = formfilters.phone;
        var photo = formfilters.photo;
        
        var data = new FormData();
        data.append("name", newname);
        data.append("species_code", species);
        data.append("title", title);
        data.append("gender", gender);
        data.append("description", description);
        data.append("address", address);
        data.append("email", email);  
        data.append("phone", phone);
        data.append("photo", photo);
        //console.log(data);

        //http://127.0.0.1:5000/lostpets/api/lostpets
        var myRequest = new Request('http://127.0.0.1:5000/lostpets/api/lostpets', {method: 'POST', body: data});
        fetch(myRequest)
            .then(function(response){
                if(response.status == 200) return response.json();
                else throw new Error('Something went wrong on api server!');
            })
            .then(function(response){
                console.log(response);
                self.getResults({lost_pet_id: response.lostpet_id});
            })
            .catch(function(error){
                console.error(error);
            });

    }

    render(){
        return (
            <div>
            <NavbarInstance onFormChanged={this.postFormValues}/>
                <div className="container-fluid">
                    <LostPetsMap pets = {this.state.pets}/>
                </div>
                <div className="container">
                    <div className="row">
                        <LostPetFilters species={this.state.species} onFilterChanged={this.getResults} />
                    </div>
                </div>
                <div className="container">
                    
                    <LostPetList pets={this.state.pets}/>
                    
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));
