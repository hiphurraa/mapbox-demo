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
            error: '',
            isLoading: false
        };
    }

    componentDidMount() {

    } // componentDidMount()

    componentWillUnmount() {
                                                        // TODO
    }

    saveMarker() {
        this.setState({isLoading: true});
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
            .then(response => response.json())
            .then(response => {
                if (response.badInput){
                    let msg = '';
                    switch (response.badInput){
                        case 'title':
                            msg = 'Otsikon tulee olla 1-25 merkkiä.';
                            break;
                        case 'description':
                            msg = 'Kuvauksen tulee olla 1-200 merkkiä.';
                            break;
                        default:
                            msg = '';
                    }
                    this.setState({badInput: msg, isLoading: false});
                }
                else {
                    this.setState({badInput: false, error: '', isLoading: false});
                    this.props.handleSave(this.props.coordinates);
                }
            })
            .catch((error)=>{
                this.setState({error: 'Odottamaton virhe!', isLoading: false});
            })

    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {

        const { badInput, error, isLoading } = this.state;

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
                                <p className='error-msg'>{error? error : ''}</p>
                                <p className='badInput-msg'>{badInput? badInput : ''}</p>
                                <p className='loading-msg'>{isLoading? 'Tallennetaan...' : ''}</p>
                            </td>
                        </tr>
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