import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Modal, Navbar, NavItem, Nav } from 'react-bootstrap';

import LostPetForm from "./LostPetForm";

//This component makes a Navbar that letme use the link botton as the trigger for the modal form of a new lostpet

export default class NavbarInstance extends React.Component{
    constructor(props){
        super(props)
        this.state = {isOpen: false};
        this.isopenModal = this.isopenModal.bind(this);
        this.iscloseModal = this.iscloseModal.bind(this);
        
        
    }

    isopenModal(){
        var openModal = !this.state.isOpen;
        this.setState({isOpen: openModal});
        console.log("They click the button");
    }

    iscloseModal(){
        var closeModal = !this.state.isOpen;
        this.setState({isOpen: closeModal});
        console.log("This close the modal");
    }

    render(){
        return (
            
            <Navbar inverse fixedTop className="navbar-wrapper">
                <Navbar.Header>
                <Navbar.Brand>
                    <a>Lost Pet
                    <img src="./src/dogcat.png" className="nav-logo" />
                    </a>
                </Navbar.Brand>
                <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                <Nav pullRight>
                <NavItem eventKey={1} onClick={this.isopenModal}>
                    Report a Pet
                </NavItem>  
                    <LostPetForm onFormChanged={this.props.onFormChanged} show={this.state.isOpen} close={this.iscloseModal} />
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
