import React from 'react';
import ReactDOM from 'react-dom';
import LostPet from "./LostPet";



//This component make a list with all the lostpet that I'm pasing in the props. 
export default class LostPetList extends React.Component{
    render(){

        var pets = [];
        
        for(var i = 0; i < this.props.pets.length; i++) {
            pets.push(<LostPet key={i} lostPet={this.props.pets[i]}/>);
            
        }

        var size = this.props.pets.length / 3;
        var columns = null;
        if (pets.length === 1){
            columns = (
            <div className="row pet-list">
              <h2> Results {this.props.pets.length} </h2>
                <div className="col-sm-4">
                    {pets}
                </div>
                <div className="col-sm-4">
                </div>
                <div className="col-sm-4">
                </div> 
            </div>
        );
        } else {
            columns = (
            <div className="row pet-list">
              <h2> Results {this.props.pets.length} </h2>
                <div className="col-sm-4">
                {pets.slice(0, size)}
                </div>
                <div className="col-sm-4">
                {pets.slice(size, size*2)}
                </div>
                <div className="col-sm-4">
                {pets.slice(size*2)}
                </div> 
            </div>
        );
        }


        return (columns);
    }
}