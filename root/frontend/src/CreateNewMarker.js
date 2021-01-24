import React from 'react';
import './CreateNewMarker.css';

export default class CreateNewMarker extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.saveMarker = this.saveMarker.bind(this);
        this.state = {
            title: '',
            description: '',
            badInput: false,
            error: ''
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
            .then((response) => {
                console.log(response.status);
                if (response.status === 200){
                    this.setState({badInput: false, error: ''});
                    this.props.handleSave(this.props.coordinates);
                    return response.json();
                }
                else if (response.status === 400){
                    this.setState({badInput: true});
                }
            })
            .catch((error)=>{
                this.setState({error: 'Odottamaton virhe!'});
            })

    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {

        const { badInput } = this.state;

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
                                <p className='errorMsg'>{this.state.error}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Otsikko: {badInput? '(1-25 merkkiä)' : ''}</label><br/>
                                <input type="text" name="title" value={this.state.title} onChange={this.handleChange}></input>
                            </td>
                        </tr>
                        <tr>
                        <td>
                            <label>Kuvaus: {badInput? '(1-200 merkkiä)' : ''}</label><br/>
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