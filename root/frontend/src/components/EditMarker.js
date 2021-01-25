import React from 'react';
import './EditMarker.css';

export default class EditMarker extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.saveMarker = this.saveMarker.bind(this);
        this.state = {
            title: this.props.marker.properties.title,
            description: this.props.marker.properties.description,
            isLoading: false
        };
    }

    componentDidMount() {

    } // componentDidMount()

    componentWillUnmount() {
                                                        // TODO
    }

    saveMarker() {
        const editedMarkerData = {
            title: this.state.title,
            description: this.state.description,
            longitude: this.props.marker.geometry.coordinates[0],
            latitude: this.props.marker.geometry.coordinates[1]
        };

        const markerId = this.props.marker.properties.id;

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: editedMarkerData})
        };
        fetch(`http://127.0.0.1:3001/markers/edit/${markerId}`, requestOptions)
            .then(response => response.json())
            .then(data=>{
                this.props.handleSave();
            })
            .catch(error=>{});
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {

        return(
        <div className="editMarker-container">
            <fieldset>
                <legend>Muokkaa merkkiä:</legend>
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
                                <br/>
                                <button className="save-btn" onClick={this.saveMarker}>Tallenna</button>
                                <button className="cancel-btn" onClick={(e) =>{this.props.handleCancel()}}>Peruuta</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
          </div>
        );

    }

}