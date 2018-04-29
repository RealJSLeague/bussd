import React, { Component } from 'react';
import axios from 'axios';
import http from '../../node_modules/axios/lib/adapters/http';
import moment from 'moment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import '../App.css';
import Map from './Map.js';
import Styles from './Styles.js';
import { H1, H2, AppHeader, AppBody, MapContainer, BodyContainer, Interface, VehicleDisplay } from './Styles.js';

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: {},
      vehicles: [],
      stops: [],
      selectedStop: 'Select a stop...',
      selectedVehicle: 'Select a vehicle...'
    };

    this.getVehicleData = this.getVehicleData.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleVehicleClick = this.handleVehicleClick.bind(this);
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
    /* const config = { adapter: http, headers: { 'Access-Control-Allow-Origin': '*' } };

    function convertSecs(time) {
      let timeSplit = time.split(':');
      let timeSplitSeconds = +timeSplit[0] * 60 * 60 + +timeSplit[1] * 60 + +timeSplit[2];
      console.log(timeSplitSeconds);
      return timeSplitSeconds;
    }

    let timeNow = moment().format('HH:mm:ss');
    convertSecs(timeNow);

    let matchedTimes = [];

    axios.get('/api/stop-times/' + stopId, config).then(res => {
      res.data.forEach(datum => {
        let convertedDatum = convertSecs(datum.arrivalTime);
        if (convertedDatum - timeNow > 0) {
          matchedTimes.push(convertedDatum);
        }
      });
    });

    console.log(matchedTimes.length); */

    this.setState({
      selectedStop: stopId
    });
  }

  handleVehicleClick(vehicleId, tripInfo, nextStop, relevantStopTime, scheduleDeviation) {
    this.setState({
      //selectedVehicle: vehicleId + ' / ' + tripId + ' / ' + nextStop + ' / ' + scheduleDeviation
      selectedStop: '',
      selectedVehicle: (
        <VehicleDisplay>
          {scheduleDeviation > 0 ? (
            <img src="https://s3.us-east-2.amazonaws.com/garethbk-portfolio/bus-icon-red.png" alt="Bus delayed" />
          ) : (
            <img src="https://s3.us-east-2.amazonaws.com/garethbk-portfolio/bus-icon-green.png" alt="Bus on time" />
          )}
          <h2>
            Bus {vehicleId} | Route {tripInfo.routeId}
          </h2>
          <h3>
            <em>Next Stop {nextStop}</em>
          </h3>
          <h3>
            <em>
              Arriving @ {relevantStopTime}
              {scheduleDeviation == 60 ? ' (' + scheduleDeviation / 60 + ' minute late)' : ''}
              {scheduleDeviation > 60 ? ' (' + scheduleDeviation / 60 + ' minutes late)' : ''}
            </em>
            <em />
          </h3>
          <h3>
            <em>Heading To {tripInfo.tripHeadSign}</em>
          </h3>
        </VehicleDisplay>
      )
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
        <div style={{ minHeight: '10vh' }} />
        <Grid style={{ paddingLeft: '0', paddingRight: '0' }}>
          <AppBody>
            <div style={{ height: '80vh' }}>
              <Map
                vehicles={this.state.vehicles}
                stops={this.state.stops}
                handleStopClick={this.handleStopClick}
                handleVehicleClick={this.handleVehicleClick}
                style={{ width: '100%' }}
              />
            </div>
            <Interface>
              <h1>{this.state.selectedStop}</h1>
              {this.state.selectedVehicle}
            </Interface>
          </AppBody>
        </Grid>
      </div>
    );
  }
}

export default App;
