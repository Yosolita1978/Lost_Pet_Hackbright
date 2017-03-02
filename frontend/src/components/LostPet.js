import React from 'react';
import ReactDOM from 'react-dom';


// The first basic component is the LostPet component. I need this to show the info of just one lost pet. 

export default class LostPet extends React.Component{
    render(){
        var lostPet = this.props.lostPet;

        var url = null;
        if (!!lostPet.url){
            url = (<a className="glyphicon" href={lostPet.url} target="_blank"><span className="glyphicon glyphicon-link">Craiglist</span></a>);
        }
        
        var email = null;
        if (!!lostPet.email){
            email = (<p id="email">Owner Email: {lostPet.email}</p>);
        }
        
        
        var phone = null;
        if (!!lostPet.phone){
            phone = (<p id="phone">Owner Phone: {lostPet.phone}</p>);
        }
        
        var contact = (
                <div className="panel-footer">
                    { email }
                    { url }
                    { phone }
                </div>
            );

        var img = null;
        if (!!lostPet.photo){
            img = (<img src={lostPet.photo} className="panel-img" />);
        } else {
            img = (<img src="https://pawedin.com/system/pets/default_images/default_pet.jpg" className="single-pet-img" />);

        }

        var address = null;
        if (!!lostPet.address && lostPet.address.length === 2){
            address == null;
        } else {
            address = (<div className="panel-footer" id="addres">Address: {lostPet.address}</div>);
        }

        var nameTitle = null;
        if(!!lostPet.lostpet_name){
            nameTitle = (
                <div className="panel-heading">
                <h2>{lostPet.lostpet_name}</h2>
                    <h5> Species: {lostPet.species_code}</h5>
                    <h4>{lostPet.title}</h4>
                </div>
            );

        } else{
            nameTitle = (
                <div className="panel-heading">
                <h2>{lostPet.title}</h2>
                    <h5> Species: {lostPet.species_code}</h5>
                    <h4>{lostPet.lostpet_name}</h4>
                    </div>
            );
        }


        
        return (

            <div className="panel panel-success">
                  { img }
                <div className="pet-info">
                  { nameTitle }
                  <div className="panel-body" id="description">
                     <span className="text-des">
                        {lostPet.description}
                     </span>
                  </div>
                  { contact }
                  { address }
                </div>
            </div>

        );
    }
}