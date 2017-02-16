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



class LostPetFilters extends React.Component{
    constructor(props){
        super(props);
        this.state = {species_code: null,
                      value: ""};
        this.onSpeciesSelected = this.onSpeciesSelected.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
        this.onSubmitText = this.onSubmitText.bind(this);
    }

    onSpeciesSelected(event){
        //console.log(event.target.value)
        var species_code = event.target.value;
        this.setState({species_code: species_code});
        this.props.onFilterChanged({species_code: species_code});

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
        this.props.onSearch(this.state.value);

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
            <form onSubmit={this.onSubmitText}> 
                { speciesButtons }
                <label htmlFor='text_search'>Search</label>
                <input type='text'
                       id='text_search'
                       value={this.state.value}
                       placeholder='Please enter a Keyword'
                       onChange={this.onValueChanged} />
            </form>
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
        this.onFilterChanged = this.onFilterChanged.bind(this);
        this.SearchByText = this.SearchByText.bind(this);
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

    SearchByText(search){
        var text_search = search;
        console.log(text_search);
        var self = this;
        //http://localhost:5000/lostpets/api/lostpets.json?text_search=dog+small
        fetch('http://127.0.0.1:5000/lostpets/api/lostpets.json?text_search='+ text_search).then(function (response){
            return response.json();
        }).then(function (data) {
            self.setState({pets: data.result});
        });
    }


    render(){
        return (
            <div>
                <LostPetFilters species={this.state.species} onFilterChanged={this.onFilterChanged} onSearch={this.SearchByText}/>
                <LostPetList pets={this.state.pets}/>
            </div>)
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));
