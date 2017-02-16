import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

function encodeQueryData(data) {
    var ret = [];
    Object.keys(data).forEach(function(d) {
        if (!!data[d]){
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        }
    });
    return ret.join('&');
}

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
            pets.push(<LostPet key={i} lostPet={this.props.pets[i]}/>);
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
        //console.log(event.target.value);
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
                <div key={i}>
                    <label htmlFor={species.species_code}>{species.name}</label>
                    <input type='radio' 
                           id={species.species_code} 
                           value={species.species_code}
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
                <div key={i}>
                    <label htmlFor={"s"+date.since}>{date.text}</label>
                    <input type='radio'
                        id={"s"+date.since}
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
                    <label htmlFor='text_search'>Search</label>
                    <input type='text'
                        id='text_search'
                        value={this.state.value}
                        placeholder='Please enter a Keyword'
                        onChange={this.onValueChanged} />
                    { datesButtons }
                </div>
            );
        }

        return ( 
            <form onSubmit={this.onSubmitText}> 
                { speciesButtons }
                { additionalFilters }

            </form>
        );
    }
}


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            species: [],
            pets: [],  
        };
        this.getResults = this.getResults.bind(this);
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


    render(){
        return (
            <div>
                <LostPetFilters species={this.state.species} onFilterChanged={this.getResults} />
                <LostPetList pets={this.state.pets}/>
            </div>)
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));
