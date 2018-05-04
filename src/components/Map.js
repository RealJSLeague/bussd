import React, { Component } from 'react';
import axios from 'axios';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { geolocated } from 'react-geolocated';
import { LoadingContainer, RefreshButton } from './Styles';
import { GeoLocation } from 'react-geolocation';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import styled, { keyframes } from 'styled-components';

/*global google*/

// const pulseAnimation = keyframes`
//   0% {-webkit-transform: scale(0);opacity: 0.0;}
//   25% {-webkit-transform: scale(0);opacity: 0.1;}
//   50% {-webkit-transform: scale(0.1);opacity: 0.3;}
//   75% {-webkit-transform: scale(0.5);opacity: 0.5;}
//   100% {-webkit-transform: scale(1);opacity: 0.0;}
// `;

// const Pulse = styled.div`
//   position: absolute;
//   left: -16px;
//   top: -15.91px;
//   height: 50px;
//   width: 50px;
//   z-index: 2;
//   opacity: 0;
//   border: 10px solid rgba(0,166,205,1);;
//   background: transparent;
//   border-radius: 60px;
//   animation: ${pulseAnimation} 2s ease-out infinite;
// `;

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
        props.setCenter(this.mapRef.getCenter().lat(), this.mapRef.getCenter().lng()), props.resetMarker();
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
                  animation={vehicle.vehicleId === props.selectedVehicle ? google.maps.Animation.BOUNCE : ''}
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
                animation={vehicle.vehicleId === props.selectedVehicle ? google.maps.Animation.BOUNCE : ''}
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
            const stopIcon = '../../bus-stop-icon.svg';
            return (
              <Marker
                animation={stop.stopId === props.selectedStop ? google.maps.Animation.BOUNCE : ''}
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
      centerLng: '',
      selectedStop: null,
      selectedVehicle: null
    };
    this.stopClickEvent = this.stopClickEvent.bind(this);
    this.vehicleClickEvent = this.vehicleClickEvent.bind(this);
    this.handleSetCenter = this.handleSetCenter.bind(this);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.handleResetMarker = this.handleResetMarker.bind(this);
  }

  stopClickEvent(stopId, lat, lng) {
    this.props.handleStopClick(stopId);

    this.setState({
      centerLat: lat,
      centerLng: lng,
      selectedStop: stopId
    });
  }

  vehicleClickEvent(vehicleLat, vehicleLng, vehicleId, tripId, nextStop, scheduleDeviation) {
    this.setState({
      centerLat: vehicleLat,
      centerLng: vehicleLng,
      selectedVehicle: vehicleId
    });

    this.props.handleVehicleClick(vehicleId, tripId, nextStop, scheduleDeviation);
  }

  handleSetCenter(lat, lng) {
    this.setState({
      centerLat: lat,
      centerLng: lng
    });
  }

  handleResetMarker() {
    this.setState({
      selectedStop: null,
      selectedVehicle: null
    })
  }

  forceUpdateHandler() {
    this.forceUpdate();
    this.setState({
      centerLat: '',
      centerLng: '',
      selectedStop: null,
      selectedVehicle: null
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
          containerElement={<div id="map-container" style={{ height: '90vh', width: 'auto', overflow: 'hidden' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          lat={this.props.coords.latitude}
          lng={this.props.coords.longitude}
          vehicles={this.props.vehicles}
          stops={this.props.stops}
          selectedStop={this.state.selectedStop}
          selectedVehicle={this.state.selectedVehicle}
          centerLat={this.state.centerLat}
          centerLng={this.state.centerLng}
          stopClickEvent={this.stopClickEvent}
          vehicleClickEvent={this.vehicleClickEvent}
          setCenter={this.handleSetCenter}
          resetMarker={this.handleResetMarker}
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