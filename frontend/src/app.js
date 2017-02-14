import React from "react";
import ReactDOM from 'react-dom';

var DATA =         {
        "datetime": "2017-02-06 16:59:29.080000", 
        "description": "Missing since May 2016. Adult female brown tabby with white chest and paws. Black collar. Responds to \"Phoebe\"", 
        "latitude": "38.347", 
        "longitude": "-122.6941", 
        "lostpet_id": 29,  
        "neighborhood": "San Simeon at RP Expressway", 
        "photo": "https://images.craigslist.org/00000_5GrGmYD4R5f_600x450.jpg", 
        "species_code": "c", 
        "title": "Missing tabby cat REWARD", 
        "url": "https://sfbay.craigslist.org/nby/laf/5992665725.html", 
    }

var App = React.createClass({
    render: function(){
        return (
            <div>
                <Profile
                    title={this.props.profileData.title}
                    description={this.props.profileData.description}
                    species={this.props.profileData.species_code}
                    id={this.props.profileData.lostpet_id}
                    imgURL={this.props.profileData.photo} />
                <MapInfo
                    latitude={this.props.profileData.latitude}
                    longitude={this.props.profileData.longitude}
                    neighborhood={this.props.profileData.neighborhood} />
            </div>

        );
    }

});

var Profile = React.createClass({
    render: function(){
        return(
            <div>
                <h2>Title:<stronger>{this.props.title}</stronger></h2>
                <p>Description: {this.props.description}</p>
                <p>Species: {this.props.species}</p>
                <p>Id: {this.props.id}</p>
                <img src={this.props.imgURL} />
                <br></br>
            </div>
            );
    }

});

var MapInfo = React.createClass({
    render: function(){
        return(
            <div>
                <p>{this.props.latitude}</p>
                <p>{this.props.longitude}</p>
                <p>{this.props.neighborhood}</p>
            </div>
            );
    }

});



ReactDOM.render(<App profileData={DATA}/>, document.getElementById('app'));