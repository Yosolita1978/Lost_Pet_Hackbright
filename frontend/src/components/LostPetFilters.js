import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';


// This component make the filters for searching for a lostpet and saw all the list of pets that match that criteria


export default class LostPetFilters extends React.Component{
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
        console.log(event.target.value);
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
                
                
                    <label key={i} className="radio-inline" htmlFor={species.species_code}>
                        <input type='radio' 
                           id={species.species_code} 
                           value={species.species_code}
                           checked={species.species_code === this.state.species_code}
                           onClick={this.onSpeciesSelected} />
                        {species.name}
                    </label>
              

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
                
                    <label className="radio-inline" key={i} htmlFor={"s"+date.since}>
                      <input type='radio'
                        id={"s"+date.since}
                        value={date.since}
                        checked={date.since === this.state.since}
                        onClick={this.onDateSelected} />
                    {date.text}
                    </label>
          

            );
        }
         var dateSelectedField = (
            <div className="form-group">
                <label className="col-sm-2 control-label">Select a Date</label>
                 <div className="col-sm-10">
                    { datesButtons }
                </div>
            </div>
        );
        
        var showAdditionalFilters = !!this.state.species_code;
        
        var search = (
            <div className="form-group">
                <label className="col-xs-2 control-label" htmlFor='text_search'> Search </label>
                <div className="col-xs-10">
                <input type='text'
                    id='text_search'
                    value={this.state.value}
                    placeholder='Please enter a Keyword'
                    className="form-control" 
                    onChange={this.onValueChanged} />
                </div>
            </div>
        );
        

        return (
            <div>
            <h1>Search a pet</h1>
            <hr className="head-border-white"/> 
            <form className="form-horizontal col-xs-12" onSubmit={this.onSubmitText}>
                
                <div className="form-group">
                    <label className="col-sm-2 control-label">Select a Species</label>
                     <div className="col-sm-10">
                        { speciesButtons }
                    </div>
                </div>
                { showAdditionalFilters ? search : "" } 
                { showAdditionalFilters ? dateSelectedField : "" }
            </form>
            <hr className="head-border-white"/> 
            </div>
        );
    }
}