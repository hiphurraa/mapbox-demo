import React from 'react';
import './CreateNewMarker.css';

export default class CreateNewMarker extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.saveMarker = this.saveMarker.bind(this);
        this.state = {
            title: '',
            description: ''
        };
    }

    componentDidMount() {

    } // componentDidMount()

    componentWillUnmount() {
                                                        // TODO
    }



    saveMarker() {
        const newMarkerData = {
            title: this.state.title,
            description: this.state.description,
            longitude: this.props.coordinates[0],
            latitude: this.props.coordinates[1]
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: newMarkerData})
        };
        fetch('http://127.0.0.1:3001/markers/create', requestOptions)
            .then((res) =>{
                if (!res.ok){
                    throw Error(res.statusText);
                }
            })
            .then((res)=>{
            })
            .catch((error)=>{
                // Delete marker and inform the user of failure
            })

        this.props.handleSave();
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {

        return(
        <div className="newMarker-container">
            <fieldset>
                <legend>Luo uusi merkki:</legend>
                <table>
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <label>Otsikko:</label><br/>
                                <input type="text" name="title" value={this.state.title} onChange={this.handleChange}></input>
                            </td>
                        </tr>
                        <tr>
                        <td>
                            <label>Kuvaus:</label><br/>
                            <input type="text" name="description" value={this.state.description} onChange={this.handleChange}></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button className="save-btn" onClick={this.saveMarker}>Tallenna</button>
                                <button className="cancel-btn" onClick={(e) =>{this.props.cancel()}}>Peruuta</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
          </div>
        );

    }

}