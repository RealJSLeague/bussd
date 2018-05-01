import React, { Component } from 'react';
import axios from 'axios';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { geolocated } from 'react-geolocated';
import { LoadingContainer, RefreshButton } from './Styles';
import { GeoLocation } from 'react-geolocation';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';

const MapWithAMarker = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      options={{ minZoom: 15, gestureHandling: 'greedy', disableDefaultUI: true }}
      defaultZoom={19}
      defaultCenter={{ lat: props.lat, lng: props.lng }}
      center={{
        lat: props.centerLat ? props.centerLat : props.lat,
        lng: props.centerLng ? props.centerLng : props.lng
      }}
      ref={ref => (this.mapRef = ref)}
      onIdle={props.onMapIdle}
      onDragEnd={() => {
        props.setCenter(this.mapRef.getCenter().lat(), this.mapRef.getCenter().lng());
      }}
    >
      <Marker position={{ lat: props.lat, lng: props.lng }} />
      {props.vehicles
        ? props.vehicles.map(vehicle => {
            const iconGreen = '../../bus-icon-green.svg';
            const iconRed = '../../bus-icon-red.svg';
            if (vehicle.location !== null && vehicle.tripStatus !== null) {
              if (vehicle.tripStatus.scheduleDeviation > 0) {
                return (
                  <Marker
                    position={{ lat: vehicle.location.lat, lng: vehicle.location.lon }}
                    onClick={() =>
                      props.vehicleClickEvent(
                        vehicle.location.lat,
                        vehicle.location.lon,
                        vehicle.vehicleId,
                        vehicle.tripId,
                        vehicle.tripStatus.nextStop,
                        vehicle.tripStatus.scheduleDeviation
                      )
                    }
                    icon={iconRed}
                  />
                );
              }
              return (
                <Marker
                  position={{ lat: vehicle.location.lat, lng: vehicle.location.lon }}
                  onClick={() =>
                    props.vehicleClickEvent(
                      vehicle.location.lat,
                      vehicle.location.long,
                      vehicle.vehicleId,
                      vehicle.tripId,
                      vehicle.tripStatus.nextStop,
                      vehicle.tripStatus.scheduleDeviation
                    )
                  }
                  icon={iconGreen}
                />
              );
            }
          })
        : console.log('no vehicles!')}
      <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
        {props.stops
          ? props.stops.map(stop => {
              const stopIcon = 'https://s3.us-east-2.amazonaws.com/garethbk-portfolio/bus-stop-icon.png';
              return (
                <Marker
                  key={stop.stopId}
                  position={{ lat: stop.stopLat, lng: stop.stopLon }}
                  icon={stopIcon}
                  onClick={() => props.stopClickEvent(stop.stopId, stop.stopLat, stop.stopLon)}
                />
              );
            })
          : console.log('no stops')}
      </MarkerClusterer>
    </GoogleMap>
  ))
);
class Map extends Component {
  constructor() {
    super();

    this.state = {
      centerLat: '',
      centerLng: ''
    };
    this.stopClickEvent = this.stopClickEvent.bind(this);
    this.vehicleClickEvent = this.vehicleClickEvent.bind(this);
    this.handleSetCenter = this.handleSetCenter.bind(this);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  }

  stopClickEvent(stopId, lat, lng) {
    this.props.handleStopClick(stopId);

    this.setState({
      centerLat: lat,
      centerLng: lng
    });
  }

  vehicleClickEvent(vehicleLat, vehicleLng, vehicleId, tripId, nextStop, scheduleDeviation) {
    this.setState({
      centerLat: vehicleLat,
      centerLng: vehicleLng
    });

    this.props.handleVehicleClick(vehicleId, tripId, nextStop, scheduleDeviation);

    /* vehicleId = vehicleId.substr(4, vehicleId.length);
    tripId = tripId.substr(4, tripId.length);
    nextStop = nextStop.substr(4, nextStop.length);
    scheduleDeviation = parseInt(scheduleDeviation);

    axios
      .all([
        axios.get('/api/stops/' + nextStop),
        axios.get('/api/trips/' + tripId),
        axios.get('/api/stop-times/' + nextStop)
      ])
      .then(
        axios.spread((stopRes, tripRes, stopTimesRes) => {
          let nextStopName = stopRes.data[0].stopName;

          let tripInfo = {
            routeId: tripRes.data[0].routeId,
            tripHeadSign: tripRes.data[0].tripHeadSign
          };

          let relevantStopTime = null;

          stopTimesRes.data.forEach(stopTime => {
            if (tripId == stopTime.tripId) {
              relevantStopTime = stopTime.arrivalTime;
              console.log(relevantStopTime);

              let rtsSplit = relevantStopTime.split(':');
              let rtsSeconds = +rtsSplit[0] * 60 * 60 + rtsSplit[1] * 60;
              console.log('Converted: ' + rtsSeconds);
              rtsSeconds = parseInt(rtsSeconds);
              console.log('Parsed: ' + rtsSeconds);
              let adjustedStopTime = scheduleDeviation + rtsSeconds;
              console.log('Adjusted: ' + adjustedStopTime);

              let adjustedHours = Math.floor(adjustedStopTime / 3600);
              adjustedStopTime %= 3600;
              let adjustedMinutes = Math.floor(adjustedStopTime / 60);

              if (adjustedHours > 12) {
                adjustedHours = adjustedHours - 12;
              }

              if (adjustedMinutes < 10) {
                adjustedMinutes = '0' + adjustedMinutes;
              }

              relevantStopTime = adjustedHours + ':' + adjustedMinutes;
              console.log(relevantStopTime);
            }
          });

          this.props.handleVehicleClick(vehicleId, tripInfo, nextStopName, relevantStopTime, scheduleDeviation);
        })
      ); */
  }

  handleSetCenter(lat, lng) {
    this.setState({
      centerLat: lat,
      centerLng: lng
    });
  }

  forceUpdateHandler() {
    this.forceUpdate();
    this.setState({
      centerLat: '',
      centerLng: ''
    });
  }

  render() {
    return !this.props.isGeolocationAvailable ? (
      <div>Your browser does not support Geolocation</div>
    ) : !this.props.isGeolocationEnabled ? (
      <LoadingContainer>
        <h1>Geolocation is taking its time...</h1>
        <div className="lds-css ng-scope" style={{ width: '200px', height: '200px' }}>
          <div className="lds-spinner" style={{ width: '100%', height: '100%' }}>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </LoadingContainer>
    ) : this.props.coords ? (
      <div style={{ position: 'relative' }}>
        <RefreshButton onClick={this.forceUpdateHandler}>Refresh</RefreshButton>
        <MapWithAMarker
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCXdLMabpElbXEYvWy9yZSj9VRf0dpFMmo&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div id="map-container" style={{ height: '80vh', width: 'auto', overflow: 'hidden' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          lat={this.props.coords.latitude}
          lng={this.props.coords.longitude}
          vehicles={this.props.vehicles}
          stops={this.props.stops}
          centerLat={this.state.centerLat}
          centerLng={this.state.centerLng}
          stopClickEvent={this.stopClickEvent}
          vehicleClickEvent={this.vehicleClickEvent}
          setCenter={this.handleSetCenter}
        />
      </div>
    ) : (
      <LoadingContainer>
        <h1>
          <em>Bussd</em>
        </h1>
        <div className="lds-css ng-scope" style={{ width: '200px', height: '200px' }}>
          <div className="lds-spinner" style={{ width: '100%', height: '100%' }}>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </LoadingContainer>
    );
  }
}
export default geolocated({
  positionOptions: {
    enableHighAccuracy: true
  },
  userDecisionTimeout: 5000
})(Map);
