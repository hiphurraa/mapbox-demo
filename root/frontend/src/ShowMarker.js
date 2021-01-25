import React from 'react';
import './ShowMarker.css';
import EditMarker from './EditMarker';
import DeleteMarker from './DeleteMarker';

export default class ShowMarker extends React.Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.state = {
            isEditingMarker: false,
            isDeletingMarker: false
        };
    }

    handleCancel () {
        this.setState({isEditingMarker: false, isDeletingMarker: false});
    }

    handleSave () {
        this.setState({isEditingMarker: false, isDeletingMarker: false});
        this.props.handleSave();
    }

    handleDelete (){
        this.props.handleDelete();
    }

    render() {

        const marker = this.props.marker;
        const {isEditingMarker, isDeletingMarker} = this.state;

        if(isEditingMarker){
            return(
                <div>
                    <EditMarker marker={this.props.marker} handleSave={this.handleSave} handleCancel={this.handleCancel}/>
                </div>
            );
        }
        else if (isDeletingMarker){
            return(
                <div>
                    <DeleteMarker marker={this.props.marker} handleDelete={this.handleDelete} handleCancel={this.handleCancel}/>
                </div>
            );
        }
        else {
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
                                        <h2 className='marker-title'>{marker.properties.title}</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p className='marker-description'>{marker.properties.description}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <br/>
                                        <button className='edit-btn' onClick={(e)=>{this.setState({isEditingMarker: true})}}>Muokkaa</button>
                                        <button className='delete-btn' onClick={(e) =>{this.setState({isDeletingMarker: true})}}>Poista</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                </div>
            );
        }

    }

}