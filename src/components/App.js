import React, { Component } from 'react';
import axios from 'axios';
import http from '../../node_modules/axios/lib/adapters/http';
import moment from 'moment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import '../App.css';
import Map from './Map.js';
import Styles from './Styles.js';
import { H1, H2, AppHeader, AppBody, MapContainer, BodyContainer, Interface, ListContainer } from './Styles.js';
import groupArray from 'group-array';
class App extends Component {
  constructor() {
    super();

    this.state = {
      response: {},
      vehicles: [],
      stops: [],
      selectedStop: 'Select a stop...',
      busStopInformation: []
      
    };

    this.getVehicleData = this.getVehicleData.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
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
    
    axios.get('/api/vehicle/', config).then(res => {
      const parsedRes = res.data;
      this.setState({ vehicles: parsedRes });
    });
  }

  handleStopClick(stopId, stopName) {
    const config = { adapter: http, headers: { 'Access-Control-Allow-Origin': '*' } };
    
    let stopTimes = {},delay = {}, timing = [];
    let timingMap = [];
    axios.get('/api/vehicle/', config)
    .then(vehicleRes => {
      for(let j=0;j< (vehicleRes.data.length);j++){  
          if ((vehicleRes.data[j].tripStatus||vehicleRes.data[j].tripStatus) !== null ){
            delay[vehicleRes.data[j].tripId.replace(/MTS_/g,"")] = 
              { scheduleDeviation: vehicleRes.data[j].tripStatus.scheduleDeviation};
          } 
        }      
      });
      axios.get('/api/stop-times/'+stopId, config)
      .then(stoptimeRes => {
        for(let i=0;i< (stoptimeRes.data.length);i++){
          
          stopTimes[stoptimeRes.data[i].tripId] = 
                    { arrivalTime: stoptimeRes.data[i].arrivalTime};
          axios.get('/api/trips/'+stoptimeRes.data[i].tripId, config)
             .then(tripRes => {
 
              let timeNow = (moment().format('HH:mm:ss'));
              let scheduledArrivalTime=moment((stopTimes[tripRes.data[0].tripId].arrivalTime),'HH:mm:ss');
              let futureTime = moment(scheduledArrivalTime,'HH:mm:ss').isAfter(moment(timeNow,'HH:mm:ss'));
              
               if(futureTime){
             
             // console.log('routeId: '+tripRes.data[0].routeId+' -- To: '+ tripRes.data[0].tripHeadSign + ' -- Scheduled Arrival Time: '+ stopTimes[tripRes.data[0].tripId].arrivalTime + '-- TripId'+tripRes.data[0].tripId);  
              let deviation = '';
              if(tripRes.data[0].tripId in delay){
               // console.log('Scheduledeviation: ' +delay[tripRes.data[0].tripId].scheduleDeviation);
                deviation = delay[tripRes.data[0].tripId].scheduleDeviation;
                if(deviation ==0){
                  deviation = 'Arrives OnTime';
                }else if (deviation < 0){
                  deviation = 'Arrives ' + deviation/60 + 'mins earlier';
                }
                else {
                  deviation = 'Delayed by ' + deviation/60 + 'mins';
                }
              } else{
               // console.log('No Data');
                deviation = 'No Data';
              }  
              
              let key = tripRes.data[0].routeId +':'+tripRes.data[0].tripHeadSign;
              let keyContains = false, counterValue = 0;
              timingMap.forEach(element => {
                let tempKeySplit = element.split('--');
                if(tempKeySplit[0] === key){
                  keyContains = true;
                  counterValue = tempKeySplit[1];
                  // break;
                }
              });
              if(keyContains){
                if(!(counterValue>3)){
                  timingMap.pop(key+'--'+counterValue);
                  timingMap.push(key+'--'+(counterValue+1));
                  timing.push(tripRes.data[0].routeId+
                    '--> '+ tripRes.data[0].tripHeadSign +
                  ' -- Scheduled Arrival Time: '+ stopTimes[tripRes.data[0].tripId].arrivalTime +
                  
                  '-- Delay : '+deviation);
                }
              }else{
                timingMap.push(key+'--'+counterValue);
                timing.push(tripRes.data[0].routeId+
                  '--> '+ tripRes.data[0].tripHeadSign + 
                  '-- Scheduled Arrival Time: '+ stopTimes[tripRes.data[0].tripId].arrivalTime + 
                  
                  '-- Delay : '+deviation);
              }            
               }  
                        
           });
        }          
    });
    
    console.log(timing);
    this.setState({
      selectedStop: stopName,
      busStopInformation: timing
      // selectedStopName: stopName
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
        <div style={{ minHeight: '10vh' }}></div>
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
              <h3>{this.state.selectedStop}</h3>
              <ListContainer>
              <ul>
                {this.state.busStopInformation.map(function(listValue){
                  return <li>{listValue}</li>;
                })}
              </ul>
              </ListContainer>
              
            </Interface>
          </AppBody>
        </Grid>
      </div>
    );
  }
}

export default App;
