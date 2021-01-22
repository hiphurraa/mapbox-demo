import React from 'react';
import mapboxgl from 'mapbox-gl';
import NavBar from './NavBar';
import './Markers.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGlwaHVycmFhIiwiYSI6ImNrazVxd24xNjA4NGQyb29hY2MzcWtyNmkifQ.-9gTy_Q35okDPCEmQlWm9A';

export default class Markers extends React.Component {
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
    fetch("http://127.0.0.1:3001/markers/info")
    .then(res => res.json())
    .then((result) => {
      this.setState({data: result, isLoading: false, error: null});
    }
    )
    .catch((error) => {
        this.setState({error: error});
    })
  }

  render() {

    const {error, isLoading, data} = this.state;

    if (error){
      return(
        <p>Virhe haettaessa dataa!</p>
      );
    }
    else if (isLoading){
      return(
        <p>Ladataan...</p>
      );
    }
    else {
      return (
        <div>
            <NavBar></NavBar>
            <div className="markers-container">
              <fieldset>
                <table>
                    <thead>
                      <tr>
                        <th>Otsikko</th>
                        <th>Kuvaus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map(function (item){
                        return(
                          <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.description}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                </table>
              </fieldset>
          </div>
        </div>
        );
    }
  }

}