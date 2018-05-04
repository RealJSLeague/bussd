import React, { Component } from 'react';
import axios from 'axios';
import http from '../../node_modules/axios/lib/adapters/http';
import moment from 'moment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import '../App.css';
import Map from './Map.js';
import Styles from './Styles.js';
import {
  H1,
  H2,
  AppHeader,
  AppBody,
  MapContainer,
  BodyContainer,
  Interface,
  VehicleDisplay,
  HideButton
} from './Styles.js';

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: {},
      vehicles: [],
      stops: [],
      selectedStop: null,
      selectedVehicle: null,
      interfaceHeight: '0px',
      interfaceButton: null
    };

    this.getVehicleData = this.getVehicleData.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleVehicleClick = this.handleVehicleClick.bind(this);
    this.hideInterface = this.hideInterface.bind(this);
  }

  componentDidMount() {
    this.callApi();
    this.intervalId = setInterval(() => this.getVehicleData(), 15000);
    this.getVehicleData();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
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
    // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    // const remoteUrl =
    //   'https://realtime.sdmts.com/api/api/where/vehicles-for-agency/MTS.json?key=' + process.env.REACT_APP_MTS_API_KEY;

    axios.get('/api/vehicle/', config).then(res => {
      const parsedRes = res.data;
      //parsedRes = JSON.parse(parsedRes);
      this.setState({ vehicles: parsedRes });
    });
  }

  handleStopClick(stopId) {
    
    axios
      .get('/api/stop-times/'+stopId+'/transform',{
        params: {
          stopId: stopId
        }
      }) 
      .then(res => {
        this.setState({
          selectedStop: stopId,
  
        });

      })
      .catch(err => {
        console.log(err);
      });
      
  }


  handleVehicleClick(vehicleId, tripId, nextStop, scheduleDeviation) {
    axios
      .get('/api/vehicle/transform', {
        params: {
          vehicleId: vehicleId,
          tripId: tripId,
          nextStop: nextStop,
          scheduleDeviation: scheduleDeviation
        }
      })
      .then(res => {
        this.setState({
          selectedStop: '',
          selectedVehicle: (
            <VehicleDisplay>
              {scheduleDeviation > 0 ? (
                <img src="../../bus-icon-red.svg" alt="Bus delayed" />
              ) : (
                <img src="../../bus-icon-green.svg" alt="Bus on time" />
              )}
              <h2>Route {res.data.routeId}</h2>
              <h3>
                <em>Next Stop {res.data.nextStopName}</em>
              </h3>
              <h3>
                <em>
                  Arriving @ {res.data.relevantStopTime}
                  {scheduleDeviation == 60 ? ' (' + scheduleDeviation / 60 + ' minute late)' : ''}
                  {scheduleDeviation > 60 ? ' (' + scheduleDeviation / 60 + ' minutes late)' : ''}
                </em>
                <em />
              </h3>
              <h3>
                <em>Heading To {res.data.tripHeadSign}</em>
              </h3>
            </VehicleDisplay>
          ),
          interfaceButton: <HideButton onClick={this.hideInterface}>X</HideButton>,
          interfaceHeight: '25vh'
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  hideInterface() {
    this.setState({
      selectedVehicle: null,
      interfaceButton: null,
      interfaceHeight: '0px'
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
        <div style={{ height: '10vh' }} />
        <Grid style={{ paddingLeft: '0', paddingRight: '0' }}>
          <AppBody>
            <div style={{ height: '90vh' }}>
              <Map
                vehicles={this.state.vehicles}
                stops={this.state.stops}
                selectedStop={this.state.selectedStop}
                selectedVehicle={this.state.selectedVehicle}
                handleStopClick={this.handleStopClick}
                handleVehicleClick={this.handleVehicleClick}
                style={{ width: '100%' }}
              />
            </div>
            <Interface style={{ height: this.state.interfaceHeight }}>
              {this.state.interfaceButton}
              {this.state.selectedStop}
              {this.state.selectedVehicle}
            </Interface>
          </AppBody>
        </Grid>
      </div>
    );
  }
}

export default App;