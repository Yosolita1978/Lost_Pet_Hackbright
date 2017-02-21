import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import {ModalContainer, ModalDialog} from 'react-modal';

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

// The first basic component is the LostPet component. I need this to show the info of just one lost pet. 

class LostPet extends React.Component{
    render(){
        var lostPet = this.props.lostPet;

        return (
            <div>
                <h2>{lostPet.title}<small>{lostPet.species_code}</small></h2>
                <p>Description:{lostPet.description}</p>
            </div>
        );
    }
}

//This component make a list with all the lostpet that I'm pasing in the props. 

class LostPetList extends React.Component{
    render(){

        var pets = [];
        
        for(var i = 0; i < this.props.pets.length; i++) {
            pets.push(<LostPet key={i} lostPet={this.props.pets[i]}/>);
        }
        return(
            <div>
                <h5> Results {this.props.pets.length} </h5>
                {pets}
            </div>
        );
    }
}

// This component make the filters for searching for a lostpet and saw all the list of pets that match that criteria

class LostPetFilters extends React.Component{
    constructor(props){
        super(props);
        this.state = {species_code: null,
                      value: "",
                      since: null
                     };
        this.onSpeciesSelected = this.onSpeciesSelected.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.onSubmitText = this.onSubmitText.bind(this);
        this.onDateSelected = this.onDateSelected.bind(this);
    }

    onSpeciesSelected(event){
        //console.log(event.target.value)
        var species_code = event.target.value;
        this.setState({species_code: species_code});

        //this.props.onFilterChanged is the method that convert this object in filters
        this.props.onFilterChanged({species_code: species_code,
                                    text_search: this.state.value,
                                    since: this.state.since});

    }

    onDateSelected(event){
        var date = event.target.value;
        this.setState({since: date});

        this.props.onFilterChanged({species_code: this.state.species_code,
                                    text_search: this.state.value,
                                    since: date });
    }

    onValueChanged(event){
        console.log(event.target.value);
        //event.preventDefault();
        var text_search = event.target.value;
        this.setState({value: text_search});
        //this.props.onFilterChanged({value: text_search});

    }

    onSubmitText(event){
        event.preventDefault();
        //this.props.onFilterChanged is the method that convert this object in filters
        this.props.onFilterChanged({text_search: this.state.value,
                                    species_code: this.state.species_code,
                                    since: this.state.since});

    }

    render(){
        var speciesButtons = [];

        for(var i=0; i < this.props.species.length; i++){
            var species = this.props.species[i];
            // console.log(species.species_code === this.state.species_code)
            speciesButtons.push(
                <div className="form-group" key={i}>
                    <label htmlFor={species.species_code}>{species.name}</label>
                    <input type='radio' 
                           id={species.species_code} 
                           value={species.species_code}
                           className="form-control"
                           checked={species.species_code === this.state.species_code}
                           onClick={this.onSpeciesSelected} />
                </div>
            );
        }

        var dates = [
            {
                since: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                text: "In the last week"
            },
            {
                since: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                text: "In the last month"
            }
        ];

        var datesButtons = [];

        for(var i=0; i < dates.length; i++){
            var date = dates[i];
            datesButtons.push(
                <div className="form-group" key={i}>
                    <label htmlFor={"s"+date.since}>{date.text}</label>
                    <input type='radio'
                        id={"s"+date.since}
                        className="form-control"
                        value={date.since}
                        checked={date.since === this.state.since}
                        onClick={this.onDateSelected} />
                </div>

            );
        }

        var additionalFilters = null;
        if (this.state.species_code){
            var additionalFilters = (
                <div>
                    <div className="form-group">
                        <label htmlFor='text_search'>Search</label>
                        <input type='text'
                            id='text_search'
                            className="form-control"
                            value={this.state.value}
                            placeholder='Please enter a Keyword'
                            onChange={this.onValueChanged} />
                    </div>
                    { datesButtons }
                </div>
            );
        }

        return (
            <form onSubmit={this.onSubmitText}>
                <h4>Want to search a pet?</h4> 
                <div className="form-group">
                    { speciesButtons }
                </div>
                { additionalFilters } 
            </form>
        );
    }
}

//This component make a form to POST a new lostpet and send the request to the server

class LostPetForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {namePet: "",
                      species: "",
                      title: "",
                      gender: "",
                      description: "",
                      neighborhood: "",
                      email: "",
                      errorMessages: {}};

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.handleSpeciesSelected = this.handleSpeciesSelected.bind(this);
        this.handleTitleForm = this.handleTitleForm.bind(this);
        this.handleGenderSelected = this.handleGenderSelected.bind(this);
        this.handleDescriptionForm = this.handleDescriptionForm.bind(this);
        this.handleNeighborhoodForm = this.handleNeighborhoodForm.bind(this);
        this.handleEmailForm = this.handleEmailForm.bind(this);
    }

    handleChangeName(event){

        var namePet = event.target.value;
        this.setState({namePet: namePet});
    }

    handleTitleForm(event){
        this.setState({title: event.target.value});
    }

    handleSpeciesSelected(event){
        var species = event.target.value;
        this.setState({species: species});
    }

    handleGenderSelected(event){
        var gender = event.target.value;
        this.setState({gender: gender});
    }

    handleDescriptionForm(event){
        var description = event.target.value;
        this.setState({description: description});
    }

    handleNeighborhoodForm(event){
        var neighborhood = event.target.value;
        this.setState({neighborhood: neighborhood});
    }

    handleEmailForm(event){
        var email = event.target.value;
        this.setState({email: email});
    }

    checkIfValid(){

        var errors = {};
        var totalErrors = 0;

        var nameNewPet = this.state.namePet;
        if (!nameNewPet || nameNewPet.length > 50){
            errors.name = "No more than 50 chars please in the name";
            totalErrors++;
        }

        //species is the species_code in the server.py
        var speciesNewPet = this.state.species;
        if (!speciesNewPet){
            errors.species = "You must select a species for your lost pet";
            totalErrors++;
        }

        var titleNewPet = this.state.title;
        if (!titleNewPet || titleNewPet.length > 400){
            errors.title = "Sorry, you're title must have less than 400 chars";
            totalErrors++;
        }

        var genderNewPet = this.state.gender;
        if (!genderNewPet){
            errors.gender = "Your lost pet need a gender";
            totalErrors++;
        }

        var descriptionNewPet = this.state.description;
        if (!descriptionNewPet || descriptionNewPet > 1500){
            errors.description = "You must provide a description of your pet";
            totalErrors++;   
        }

        var neighborhoodNewPet = this.state.neighborhood;
        if (!neighborhoodNewPet || neighborhoodNewPet > 400){
            errors.neighborhood = "You must provide a neighborhood";
            totalErrors++;      
        }

        var emailNewPet = this.state.email;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(emailNewPet)){
            errors.email = "You must provide a valid email";
            totalErrors++;
        }

        if (totalErrors === 0){
            return null;
        } else {
            return errors;
        }
        
    }


    handleSubmitForm(event){ 
        event.preventDefault();

        var errorMessages = this.checkIfValid();

        if (!!errorMessages) {
            this.setState({errorMessages: errorMessages});
        } else {
            this.props.onFormChanged({namePet: this.state.namePet,
                                      species: this.state.species,
                                      title: this.state.title,
                                      gender: this.state.gender,
                                      description: this.state.description,
                                      neighborhood: this.state.neighborhood,
                                      email: this.state.email});
            this.setState({namePet: "",
                           species: "",
                           title: "",
                           gender: "",
                           description: "",
                           neighborhood: "",
                           email: "",
                           errorMessages: {}});
        }
        
    }

    render(){
        var speciesForm = [
            {
                species: "dog",
                species_code: "d"
            },
            {
                species: "cat",
                species_code: "c"
            }
        ];

        var speciesFormsButtons = [];

        for(var i=0; i < speciesForm.length; i++){
            var speciesJ = speciesForm[i];
            speciesFormsButtons.push(
                <div key={i}>
                    <div className="form-group">
                        Species:
                        <label htmlFor={speciesJ.species_code}>{speciesJ.species}</label>
                        <input type='radio'
                            id={speciesJ.species_code}
                            className="form-control"
                            value={speciesJ.species_code}
                            checked={speciesJ.species_code === this.state.species}
                            onClick={this.handleSpeciesSelected} />
                    </div>
                </div>

            );
        }

        var genderForm = [
            {
                gender: "Male",
                gender_code: "M"
            },
            {
                gender: "Female",
                gender_code: "F"
            }
        ];

        var genderFormsButtons = [];

        for(var i=0; i < genderForm.length; i++){
            var gender = genderForm[i];
            genderFormsButtons.push(
                <div key={i}>
                    <div className="form-group">
                        Gender:
                        <label htmlFor={gender.gender_code}>{gender.gender}</label>
                        <input type='radio'
                            id={gender.gender_code}
                            value={gender.gender_code}
                            className="form-control"
                            checked={gender.gender_code === this.state.gender}
                            onClick={this.handleGenderSelected} />
                    </div>
                </div>

            );
        }


        return(
            <div>
                <form onSubmit={this.handleSubmitForm}>
                    <h4> Please Report a Lost Pet </h4>

                    <div className="form-group">
                    <label>
                    Name: <span className="error">{this.state.errorMessages.name}</span>
                    <input type='text' className="form-control" value={this.state.namePet} placeholder="Name missing Pet" onChange={this.handleChangeName} />
                    </label>
                    </div>
                    
                    <span className="error">{this.state.errorMessages.species}</span>
                    { speciesFormsButtons }
                    
                    <div className="form-group">
                    <label>
                    Title: <span className="error">{this.state.errorMessages.title}</span>
                    <input type='text' className="form-control" placeholder="Title of your post" value={this.state.title} onChange={this.handleTitleForm} />
                    </label>
                    </div>

                    <span className="error">{this.state.errorMessages.gender}</span>
                    { genderFormsButtons }
                    
                    <div className="form-group">
                    <label>
                    Description: <span className="error">{this.state.errorMessages.description}</span>
                    <input type='textarea' className="form-control" placeholder="Please describe your pet" value={this.state.description} onChange={this.handleDescriptionForm} />
                    </label>
                    </div>
                    
                    <div className="form-group">
                    <label>
                    Neighborhood: <span className="error">{this.state.errorMessages.neighborhood}</span>
                    <input type='text' className="form-control" placeholder="Where does your pet live?" value={this.state.neighborhood} onChange={this.handleNeighborhoodForm} />
                    </label>
                    </div>
                    
                    <div className="form-group">
                    <label>
                    Email: <span className="error">{this.state.errorMessages.email}</span>
                    <input type='text' className="form-control" placeholder="How can we contact you?" value={this.state.email} onChange={this.handleEmailForm} />
                    </label>
                    </div>
                    
                    <div className="form-group">
                    <button type="submit" value="submit">Report {this.state.namePet} </button>
                    </div>
                </form>
            </div>
        );
    }
}

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
                    <LostPet lostPet={pet} />
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
            defaultZoom={9}
            defaultCenter={{ lat: 37.773, lng: -122.431 }}>
            
            { markers }

        </GoogleMap>
    );
});

//This component pass the lostpet list component to the GoogleMaps component to use that information

class LostPetsMap extends React.Component{
    constructor(props){
        super(props);
        this.state = {selected_pet: null};
        this.onMarkerClick = this.onMarkerClick.bind(this);
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
                    <div style={{ height: '400px' }} />
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

//This component makes a Navbar that letme use the link botton as the trigger for the modal form of a new lostpet

class NavbarInstance extends React.Component{
    constructor(props){
        super(props)
        this.state = {isOpen: false};
        this.toggleModal = this.toggleModal.bind(this);
        
        
    }

    toggleModal(event){
        this.setState({isOpen: !this.state.isOpen});
        console.log("They click the button")
    }

    render(){
        return (
            <Navbar inverse fixedTop>
                <Navbar.Header>
                <Navbar.Brand>
                    <a>Search Lost Pet</a>
                </Navbar.Brand>
                <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                <Nav pullRight>
                    <NavItem eventKey={1} onClick={this.toggleModal}>
                    {this.props.text}
                    </NavItem> 

                    
                    <ModalLostPet show={this.state.isOpen} onClose={this.toggleModal}>
                    Here goes the contente of a model box
                    </ModalLostPet>
                    

                </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

//This component create the modal with the component for the form to report a new lostpet

class ModalLostPet extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        if (!this.props.isModalOpen){
            return null;
        }
        // the gray background in the modal mode (creo)
        const backdropStyle = {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,3)',
            padding: 50
        };

        //The actually modal window
        const modalStyle = {
            backgroundColor: '#fff',
            borderRadius: 5,
            maxWidth: 500,
            minHeight: 300,
            margin: '0 auto',
            padding: 30
        };
        return (
            <div className="backdrop" style={backdropStyle}>
                <div className="modal" style={modalStyle}>
                    {this.props.children}
                    <div className="footer">
                        <button onClick={this.props.onClose}>
                        Close the modal
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}


//This component is the App component of all the others, except the navbar

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            species: [],
            pets: [],
            formvalues: {name: "",
                        species: "",
                        title: "",
                        gender: "", 
                        description: "",
                        neighborhood: "",
                        email: ""}  
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
        var url = 'http://127.0.0.1:5000/lostpets/api/lostpets.json?';
        //var params = {text_search: this.text_search, species_code: this.selected_species}
        url += encodeQueryData(params)

        fetch(url).then(function (response){
            return response.json();
        }).then(function (data) {
            self.setState({pets: data.result});
        });

    }

    postFormValues(formfilters){
        var self = this;
        
        var newname = formfilters.namePet;
        var species = formfilters.species;
        var title = formfilters.title;
        var gender = formfilters.gender;
        var description = formfilters.description;
        var neighborhood = formfilters.neighborhood;
        var email = formfilters.email;
        
        var data = new FormData();
        data.append("name", newname);
        data.append("species_code", species);
        data.append("title", title);
        data.append("gender", gender);
        data.append("description", description);
        data.append("neighborhood", neighborhood);
        data.append("email", email);  
        
        //console.log(data);

        //http://127.0.0.1:5000/lostpets/api/lostpets
        var myRequest = new Request('http://127.0.0.1:5000/lostpets/api/lostpets', {method: 'POST', body: data});
        fetch(myRequest)
            .then(function(response){
                if(response.status == 200) return response.json();
                else throw new Error('Something went wrong on api server!');
            })
            .then(function(response){
                console.debug(response);
            })
            .catch(function(error){
                console.error(error);
            });

    }

    render(){
        return (
            <div>
            <NavbarInstance />
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                    <LostPetFilters species={this.state.species} onFilterChanged={this.getResults} />
                    </div>
                    <div className="col-md-6">
                    <LostPetsMap pets = {this.state.pets}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                    <LostPetList pets={this.state.pets}/>
                    </div>
                    <div className="col-md-6">
                    <LostPetForm onFormChanged={this.postFormValues}/>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));
