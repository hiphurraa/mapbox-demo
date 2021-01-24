import React from 'react';
import './ShowMarker.css';

export default class CreateNewMarker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        const marker = this.props.marker;

        return(
        <div className="showMarker-container">
            <fieldset>
                <legend>Merkki:</legend>
                <table>
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <h2>{marker.properties.title}</h2>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>{marker.properties.description}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button>Muokkaa</button>
                                <button>Poista</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
          </div>
        );

    }

}