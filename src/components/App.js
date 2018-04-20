import React, { Component } from 'react';
import axios from 'axios';
import http from '../../node_modules/axios/lib/adapters/http';
import '../App.css';

// import '../App.css';
import Map from './Map.js';
import Styles from './Styles.js';
import { H1,H2,AppHeader,AppBody,MapContainer,BodyContainer } from './Styles.js';
class App extends Component {
  constructor() {
    super();

    this.state = {
      response: 'default'
    };
  }

  componentDidMount() {
    this.callApi();
  }

  callApi = async () => {
    const config = {
      adapter: http,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };

    axios.all([axios.get('/api/vehicles/', config), axios.get('/api/stops/', config)]).then(
      axios.spread((vehiclesRes, stopsRes) => {
        const responseBody = {
          vehicles: vehiclesRes.data,
          stops: stopsRes.data
        };
        this.setState({
          response: responseBody
        });
      })
    );
  };

  render() {
    
    return (
      
      <div className="App">
      
       <AppHeader>
         <H2><h1 className="App-title">Bussd</h1></H2>  
       </AppHeader>
       
       <AppBody>
         <BodyContainer >
          <MapContainer>
            <Map  />
          </MapContainer>
          </BodyContainer >
       </AppBody>
     
     </div> 
       
       
    );
  }
}

export default App;
