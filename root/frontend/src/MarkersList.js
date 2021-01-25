import React from 'react';
import mapboxgl from 'mapbox-gl';
import NavBar from './NavBar';
import './MarkersList.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGlwaHVycmFhIiwiYSI6ImNrazVxd24xNjA4NGQyb29hY2MzcWtyNmkifQ.-9gTy_Q35okDPCEmQlWm9A';

export default class MarkersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoading: true,
      data: null
    };
  }

  componentDidMount () {
    this.setState({isLoading: true, error: null});

    fetch("http://127.0.0.1:3001/markers/info/all")
    .then(res => res.json())
    .then((result) => {
      this.setState({data: result, isLoading: false, error: null});
    }
    )
    .catch((error) => {
        this.setState({error: error, isLoading: false});
    })
  }

  showMarkerOnMap() {
    alert('toimii');
  }

  MyTable(props){
      return(
        <table>
          <thead>
            <tr>
              <th>Otsikko</th>
              <th>Kuvaus</th>
            </tr>
          </thead>
          <tbody>
            {props.data.map((item) => {
              return(
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
  }

  render() {
    const {error, isLoading, data} = this.state;
    const isData = (data != null && data.length > 0);

    return (
        <div>
            <NavBar></NavBar>
            <div className="markersList-container">
              <fieldset>
                <legend>Merkinnät:</legend>
                {(!error && !isLoading && isData)? <this.MyTable data={data}/> : ''}
                {(!isData)? <h3>Ei merkkejä!</h3> : ''}
                {error? <h3>Virhe haettaessa dataa!</h3> : ''}
                {isLoading? <h3>Ladataan...</h3> : ''}
              </fieldset>
          </div>
        </div>
      );
  }

}