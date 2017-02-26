import React from 'react';
import ReactDOM from 'react-dom';


// The first basic component is the LostPet component. I need this to show the info of just one lost pet. 

export default class LostPet extends React.Component{
    render(){
        var lostPet = this.props.lostPet;

        var url = null;
        if (!!lostPet.url){
            url = (<a id="url" href={lostPet.url} target="_blank">Link to Craiglist</a>);
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
                <div>
                    { email }
                    { url }
                    { phone }
                </div>
            );

        var img = null;
        if (!!lostPet.photo){
            img = (<img src={lostPet.photo} id="img" />);
        } else {
            img = (<img src="https://pawedin.com/system/pets/default_images/default_pet.jpg" id="img" />);

        }

        var address = null;
        if(!!lostPet.address){
            address = (<div id="addres">Address: {lostPet.address}</div>)
        }

        var nameTitle = null;
        if(!!lostPet.lostpet_name){
            nameTitle = (
                <div>
                <h2>{lostPet.lostpet_name}<small> Specie: {lostPet.species_code}</small></h2>
                    <h4>{lostPet.title}</h4>
                </div>
            );

        } else{
            nameTitle = (
                <div>
                <h3>{lostPet.title}<small> Specie: {lostPet.species_code}</small></h3>
                    <h4>{lostPet.lostpet_name}</h4>
                    </div>
            );
        }


        
        return (

            <div className="single-pet">
                  { nameTitle }
                  { img }
                  <div className="description" id="description">Description:
                     <span className="text-des">
                        {lostPet.description}
                     </span>
                  </div>
                  { contact }
                  { address }
            </div>

        );
    }
}