import React from "react";
import ReactDOM from 'react-dom';



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

class LostPetList extends React.Component{
    render(){

        var pets = [];
        
        for(var i = 0; i < this.props.pets.length; i++) {
            pets.push(<LostPet lostPet={this.props.pets[i]}/>);
        }
        return(
            <div>
                {pets}
            </div>
        );
    }
}


// fetch('http://127.0.0.1:5000/lostpets/api/lostpets.json').then(function (response){
//     return response.json();
// }).then(function (data) {
//     ReactDOM.render(<LostPetList pets={data.result}/>, document.getElementById('list'));;
// });



class LostPetFilters extends React.Component{
    constructor(props){
        super(props);
        this.state = {species_code: null};
        this.onSpeciesSelected = this.onSpeciesSelected.bind(this);
    }

    onSpeciesSelected(event){
        //console.log(event.target.value)
        var species_code = event.target.value;
        this.setState({species_code: species_code});
        this.props.onFilterChanged({species_code: species_code});

    }

    render(){
        var speciesButtons = [];

        for(var i=0; i < this.props.species.length; i++){
            var species = this.props.species[i];
            // console.log(species.species_code === this.state.species_code)
            speciesButtons.push(
                <div>
                    <label htmlFor={species.species_code}>{species.name}</label>
                    <input type='radio' 
                           id={species.species_code} 
                           value={species.species_code}
                           checked={species.species_code === this.state.species_code}
                           onClick={this.onSpeciesSelected} />
                </div>
            );
        }

        return ( 
            <div> { speciesButtons } </div>
        );
    }
}


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            species: [],
            pets: []
        };
        this.onFilterChanged = this.onFilterChanged.bind(this)
    }

    componentDidMount(){
        var self = this;
        fetch('http://127.0.0.1:5000/lostpets/api/species').then(function (response){
            return response.json();
        }).then(function (data) {
            self.setState({species: data});
        });
    }

    onFilterChanged(filters){
        //console.log(filters);
        var species_code = filters.species_code;
        var self = this;
        fetch('http://127.0.0.1:5000/lostpets/api/lostpets.json?species_code='+ species_code).then(function (response){
            return response.json();
        }).then(function (data) {
            self.setState({pets: data.result});
        });
    }

    render(){
        return (
            <div>
                <LostPetFilters species={this.state.species} onFilterChanged={this.onFilterChanged}/>
                <LostPetList pets={this.state.pets}/>
            </div>)
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));

// class Hello extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {greeting: "Hello"};
//         this.changeGreeting = this.changeGreeting.bind(this);
//     }

//     changeGreeting() {
//         var newGreeting;

//         if (this.state.greeting == "Hello") {
//             newGreeting = "Goodbye";
//         } else {
//             newGreeting = "Hello";
//         }

//         this.setState({greeting: newGreeting});
//     }

//     render() {
//         var name;

//         if (this.props.name) {
//             name = <strong>{this.props.name}</strong>;
//         } else {
//             name = "mundo";
//         }

//         return <p onClick={this.changeGreeting}>{this.state.greeting}, {name}!</p>;
//     }
// }

// class App extends React.Component {
//     render() {
//         var greetings = [];

//         for(var i = 0; i < this.props.names.length; ++i){
//             greetings.push(<Hello name={this.props.names[i]}/>);
//         }

//         return (
//             <div>
//                 { greetings }
//             </div>
//         );
//     }
// }

// ReactDOM.render(<App names={["Jair", "Cristina"]}/>, document.getElementById('app'));