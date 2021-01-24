import React from 'react';
import './DeleteMarker.css';

export default class DeleteMarker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.marker.properties.title
        };
    }

    componentDidMount() {

    } // componentDidMount()

    componentWillUnmount() {
                                                        // TODO
    }

    deleteMarker = () => {

        const markerId = this.props.marker.properties.id;

        fetch(`http://127.0.0.1:3001/markers/delete/${markerId}`, {method: 'DELETE'})
            .then((response) => {
                if (response.status === 200){
                    this.props.delete();
                }
                else {
                    
                }
            });
    }

    cancel () {
        this.props.cancel();
    }


    render() {

        const title = this.props.marker.properties.title;

        return(
        <div className="newMarker-container">
            <fieldset>
                <legend>Poista merkki:</legend>
                <table>
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <p>{title}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h2>Haluatko varmasti poistaa merkin?</h2>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button className="save-btn" onClick={this.deleteMarker}>Poista</button>
                                <button className="cancel-btn" onClick={(e) =>{this.cancel()}}>Peruuta</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
          </div>
        );

    }

}