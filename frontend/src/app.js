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

class LostPetForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {namePet: "",
                      species: "",
                      title: "",
                      gender: "",
                      description: "",
                      neighborhood: "",
                      email: ""};

        this.handleChangeForm = this.handleChangeForm.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.handleSpeciesSelected = this.handleSpeciesSelected.bind(this);
        this.handleTitleForm = this.handleTitleForm.bind(this);
        this.handleGenderSelected = this.handleGenderSelected.bind(this);
        this.handleDescriptionForm = this.handleDescriptionForm.bind(this);
        this.handleNeighborhoodForm = this.handleNeighborhoodForm.bind(this);
        this.handleEmailForm = this.handleEmailForm.bind(this);
    }

    handleChangeForm(event){
        this.setState({namePet: event.target.value});
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

    handleSubmitForm(event){
        
        event.preventDefault();
        this.props.onFormChanged({namePet: this.state.namePet,
                                  species: this.state.species,
                                  title: this.state.title,
                                  gender: this.state.gender,
                                  description: this.state.description,
                                  neighborhood: this.state.neighborhood,
                                  email: this.state.email});
        //console.log(this.state)
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
                    <label htmlFor={speciesJ.species_code}>{speciesJ.species}</label>
                    <input type='radio'
                        id={speciesJ.species_code}
                        value={speciesJ.species_code}
                        checked={speciesJ.species_code === this.state.species}
                        onClick={this.handleSpeciesSelected} />
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
                    <label htmlFor={gender.gender_code}>{gender.gender}</label>
                    <input type='radio'
                        id={gender.gender_code}
                        value={gender.gender_code}
                        checked={gender.gender_code === this.state.gender}
                        onClick={this.handleGenderSelected} />
                </div>

            );
        }


        return(
            <div className="container">
                <h5> Please Report a Lost Pet </h5>
                <form onSubmit={this.handleSubmitForm}>
                <label>
                    Name:
                    <input type='text' value={this.state.namePet} onChange={this.handleChangeForm} />
                </label>
                <label>
                    Species:
                    { speciesFormsButtons }
                </label>
                <label>
                    Title:
                    <input type='text' value={this.state.title} onChange={this.handleTitleForm} />
                </label>
                <label>
                    Gender:
                    { genderFormsButtons }
                </label>
                <label>
                    Description:
                    <input type='textarea' value={this.state.description} onChange={this.handleDescriptionForm} />
                </label>
                <label>
                    Neighborhood:
                    <input type='text' value={this.state.neighborhood} onChange={this.handleNeighborhoodForm} />
                </label>
                <label>
                    Email:
                    <input type='text' value={this.state.email} onChange={this.handleEmailForm} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            </div>
        );
    }
}


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
        this.state.formvalues.name = newname;
        this.state.formvalues.species = species;
        this.state.formvalues.title = title;
        this.state.formvalues.gender = gender;
        this.state.formvalues.description = description;
        this.state.formvalues.neighborhood = neighborhood;
        this.state.formvalues.email = email;
        var data = this.state.formvalues;
        console.log(data);

        // http://127.0.0.1:5000/lostpets/api/lostpets
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
                <LostPetFilters species={this.state.species} onFilterChanged={this.getResults} />
                <LostPetList pets={this.state.pets}/>
                <LostPetForm onFormChanged={this.postFormValues}/>
            </div>)
    }
}

ReactDOM.render(<App/>, document.getElementById("app"));
