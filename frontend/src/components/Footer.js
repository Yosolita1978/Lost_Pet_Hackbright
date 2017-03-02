import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Modal, Navbar, NavItem, Nav } from 'react-bootstrap';



//This component makes a footer that is sticky to the end of the app

export default class Footer extends React.Component{

    render(){
        return (
            
            <footer>
              <div className="container">
                <p className="text-muted">Copyright© Cristina Rodriguez | Hackbright Academy 2017</p>
              </div>
            </footer>
        );
    }
}
