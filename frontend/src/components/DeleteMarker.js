import React from 'react';
import './DeleteMarker.css';

export default class DeleteMarker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.marker.properties.title,
            isLoading: false
        };
    }

    deleteMarker = () => {
        this.setState({isLoading: true})

        const markerId = this.props.marker.properties.id;
        fetch(`http://127.0.0.1:3001/markers/delete/${markerId}`, {method: 'DELETE'})
            .then((response) => {
                if (response.status === 200){
                    this.props.handleDelete();
                }
                else {
                    
                }
            });

        //this.setState({isLoading: false});
    }

    cancel () {
        this.props.handleCancel();
    }

    render() {

        const title = this.props.marker.properties.title;
        const {isLoading} = this.state;

        return(
        <div className="deleteMarker-container">
            <fieldset>
                <legend>Poista merkki:</legend>
                <table>
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <h2 className='delete-warning'>{isLoading? 'Poistetaan...' : 'Haluatko varmasti poistaa merkin?'}</h2>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p className='marker-title'>({title})</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <br/>
                                <button disabled={isLoading} className="delete-btn" onClick={this.deleteMarker}>Poista</button>
                                <button disabled={isLoading} className="cancel-btn" onClick={(e) =>{this.cancel()}}>Peruuta</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
          </div>
        );

    }

}