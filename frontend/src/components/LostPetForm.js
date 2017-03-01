import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Navbar, NavItem, Nav } from 'react-bootstrap';
import DropzoneComponent from 'react-dropzone-component';
import Dropzone from 'react-dropzone';
import request from 'superagent';

import DropzoneDemo from "./DropzoneDemo";


//This component make a form to POST a new lostpet and send the request to the server

export default class LostPetForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {namePet: "",
                      species: "",
                      title: "",
                      gender: "",
                      description: "",
                      address: "",
                      email: "",
                      phone: "",
                      photo: "",
                      imageUploading: false,
                      errorMessages: {}};

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.handleSpeciesSelected = this.handleSpeciesSelected.bind(this);
        this.handleTitleForm = this.handleTitleForm.bind(this);
        this.handleGenderSelected = this.handleGenderSelected.bind(this);
        this.handleDescriptionForm = this.handleDescriptionForm.bind(this);
        this.handleAddressForm = this.handleAddressForm.bind(this);
        this.handleEmailForm = this.handleEmailForm.bind(this);
        this.handlePhoneForm = this.handlePhoneForm.bind(this);
        this.onImageUploaded = this.onImageUploaded.bind(this);
        this.onImageUploadStart = this.onImageUploadStart.bind(this);
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

    handleAddressForm(event){
        var address = event.target.value;
        this.setState({address: address});
    }

    handleEmailForm(event){
        var email = event.target.value;
        this.setState({email: email});
    }

    handlePhoneForm(event){
        var phone = event.target.value;
        this.setState({phone: phone});
    }

    onImageUploaded(url){

        this.setState({photo: url,
                       imageUploading: false
        });
        console.log("This is the url", url);

    }

    onImageUploadStart(){
        this.setState({imageUploading: true});
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

        var addressNewPet = this.state.address;
        if (!addressNewPet || addressNewPet > 400){
            errors.address = "You must provide a address";
            totalErrors++;      
        }

        var emailNewPet = this.state.email;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(emailNewPet)){
            errors.email = "You must provide a valid email";
            totalErrors++;
        }

        var phoneNewPet = this.state.phone;
        console.log(!!phoneNewPet);
        if (!!phoneNewPet){
            var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            if (!re.test(phoneNewPet)){
                errors.phone = "Please enter a valid phone";
                totalErrors++;
            }
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
            console.log("Handle submit Form", this.state);
            this.props.onFormChanged({namePet: this.state.namePet,
                                      species: this.state.species,
                                      title: this.state.title,
                                      gender: this.state.gender,
                                      description: this.state.description,
                                      address: this.state.address,
                                      email: this.state.email,
                                      phone: this.state.phone,
                                      photo: this.state.photo});
            this.setState({namePet: "",
                           species: "",
                           title: "",
                           gender: "",
                           description: "",
                           address: "",
                           email: "",
                           phone: "",
                           photo: "",
                           errorMessages: {}});

            this.props.close();
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
                    <div className="checkbox">
                        <label htmlFor={speciesJ.species_code}>{speciesJ.species}
                        <input type='checkbox'
                            id={speciesJ.species_code}
                            value={speciesJ.species_code}
                            checked={speciesJ.species_code === this.state.species}
                            onClick={this.handleSpeciesSelected} />
                        </label>
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
                    <div className="checkbox">
                        <label htmlFor={gender.gender_code}>{gender.gender}
                        <input type='checkbox'
                            id={gender.gender_code}
                            value={gender.gender_code}
                            checked={gender.gender_code === this.state.gender}
                            onClick={this.handleGenderSelected} />
                        </label>
                    </div>
                </div>

            );
        }


        return(
            <Modal show={this.props.show} onHide={this.props.close} aria-labelledby="ModalHeader">
                <Modal.Header closeButton>
                    <Modal.Title>Report a Lost Pet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.handleSubmitForm}>
                        <div className="form-group">
                        <label className="col-sm-2"> Name </label>
                        <div className="col-sm-10">
                        <span className="error">{this.state.errorMessages.name}</span>
                        <input type='text' className="form-control" value={this.state.namePet} placeholder="Name missing Pet" onChange={this.handleChangeName} />
                        </div>
                        </div>
                        
                        <div className="form-group">
                        <label className="col-sm-2 control-label">Species</label>
                        <div className="col-sm-10">
                        <span className="error">{this.state.errorMessages.species}</span>
                        { speciesFormsButtons }
                        </div>
                        </div>
                        
                        <div className="form-group">
                        <label className="col-sm-2"> Title </label>
                         <div className="col-sm-10">
                         <span className="error">{this.state.errorMessages.title}</span>
                        <input type='text' className="form-control" placeholder="Title of your post" value={this.state.title} onChange={this.handleTitleForm} />
                        </div>
                        </div>

                        <div className="form-group">
                        <label className="col-sm-2 control-label">Gender</label>
                        <div className="col-sm-10">
                        <span className="error">{this.state.errorMessages.gender}</span>
                        { genderFormsButtons }
                        </div>
                        </div>
                        
                        <div className="form-group" rows="3">
                        <label className="col-sm-2"> Description </label>
                         <div className="col-sm-10">
                         <span className="error">{this.state.errorMessages.description}</span>
                        <textarea className="form-control" rows="3" placeholder="Please describe your pet" value={this.state.description} onChange={this.handleDescriptionForm} ></textarea>
                        </div>
                        </div>
                        
                        <div className="form-group">
                        <label className="col-sm-2"> Address </label>
                        <div className="col-sm-10">
                         <span className="error">{this.state.errorMessages.address}</span>
                        <input type='text' className="form-control" placeholder="Where does your pet live?" value={this.state.address} onChange={this.handleAddressForm} />
                        </div>
                        </div>
                        
                        <div className="form-group">
                        <label className="col-sm-2"> Email </label>
                        <div className="col-sm-10">
                         <span className="error">{this.state.errorMessages.email}</span>
                        <input type='text' className="form-control" placeholder="How can we contact you?" value={this.state.email} onChange={this.handleEmailForm} />
                        </div>
                        </div>

                        <div className="form-group">
                        <label className="col-sm-2"> Phone </label>
                        <div className="col-sm-10">
                        <span className="error">{this.state.errorMessages.phone}</span>
                        <input type='number' className="form-control" placeholder="How can we contact you?" value={this.state.phone} onChange={this.handlePhoneForm} />
                        </div>
                        </div>

                        <div className="form-group">
                        <label className="col-sm-3"> Photo </label>
                        <div className="col-sm-9">
                        <DropzoneDemo onImageUploadStart={this.onImageUploadStart} onImageUploaded={this.onImageUploaded} />
                        </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>Close</Button>
                    <Button bsStyle="primary" onClick={this.handleSubmitForm} disabled={this.state.imageUploading}>Report {this.state.namePet} </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
