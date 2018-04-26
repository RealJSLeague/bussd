import React, { Component } from 'react';
import axios from 'axios';
import http from '../../node_modules/axios/lib/adapters/http';
import { Grid, Row, Col } from 'react-flexbox-grid';
import '../App.css';
import Map from './Map.js';
import Styles from './Styles.js';
import { H1, H2, AppHeader, AppBody, MapContainer, BodyContainer, Interface } from './Styles.js';
class App extends Component {
  constructor() {
    super();

    this.state = {
      response: {},
      vehicles: [],
      stops: [],
      selectedStop: 'Select a stop...'
    };

    this.getVehicleData = this.getVehicleData.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
  }

  componentDidMount() {
    this.callApi();
    this.getVehicleData();
  }

  callApi = async () => {
    const config = {
      adapter: http,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };

    axios
      .all([
        axios.get('/api/routes/', config),
        //axios.get('/api/stop-times/', config),
        axios.get('/api/stops/', config)
        //axios.get('/api/trips/', config)
      ])
      .then(
        axios.spread((routesRes, stopsRes) => {
          // console.log(routesRes, stopsRes);
          const responseBody = {
            routes: routesRes.data,
            stops: stopsRes.data
          };
          this.setState({
            stops: stopsRes.data
          });
        })
      );
  };

  getVehicleData() {
    const config = { adapter: http, headers: { 'Access-Control-Allow-Origin': '*' } };
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const remoteUrl =
      'https://realtime.sdmts.com/api/api/where/vehicles-for-agency/MTS.json?key=' + process.env.REACT_APP_MTS_API_KEY;

    axios.get(proxyUrl + remoteUrl, config).then(res => {
      const parsedRes = res.data.data.list;
      //parsedRes = JSON.parse(parsedRes);
      this.setState({ vehicles: parsedRes });
    });
  }

  handleStopClick(stopId) {
    console.log(stopId);
    this.setState({
      selectedStop: stopId
    });
  }

  render() {
    return (
      <div className="App">
        <AppHeader>
          <Grid>
            <h1 className="App-title">Bussd</h1>
          </Grid>
        </AppHeader>

        <Grid style={{ paddingLeft: '0', paddingRight: '0' }}>
          <AppBody>
            <div style={{ height: '80vh' }}>
              <Map
                vehicles={this.state.vehicles}
                stops={this.state.stops}
                handleStopClick={this.handleStopClick}
                style={{ width: '100%' }}
              />
            </div>
            <Interface>
              <h1>{this.state.selectedStop}</h1>
            </Interface>
          </AppBody>
        </Grid>
      </div>
    );
  }
}

export default App;
