import React, { Component } from 'react';
import axios from 'axios';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { geolocated } from 'react-geolocated';
import { LoadingContainer, RefreshButton } from './Styles';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import styled, { keyframes } from 'styled-components';

/*global google*/

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
      onClick={() => {
        props.hideInterface();
        props.resetMarker();
      }}
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
                    animation={
                      vehicle.vehicleId === props.selectedIcon && props.iconBounce ? google.maps.Animation.BOUNCE : ''
                    }
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
                  animation={
                    vehicle.vehicleId === props.selectedIcon && props.iconBounce ? google.maps.Animation.BOUNCE : ''
                  }
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
                  animation={stop.stopId === props.selectedIcon && props.iconBounce ? google.maps.Animation.BOUNCE : ''}
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
      selectedIcon: null
    };
    this.stopClickEvent = this.stopClickEvent.bind(this);
    this.vehicleClickEvent = this.vehicleClickEvent.bind(this);
    this.handleSetCenter = this.handleSetCenter.bind(this);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.handleResetMarker = this.handleResetMarker.bind(this);
  }

  stopClickEvent(stopId, lat, lng) {
    this.setState({
      selectedIcon: stopId
    });

    this.props.handleIconBounce();
    this.props.handleStopClick(stopId);
  }

  vehicleClickEvent(vehicleLat, vehicleLng, vehicleId, tripId, nextStop, scheduleDeviation) {
    this.setState({
      selectedIcon: vehicleId
    });

    this.props.handleIconBounce();
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
      selectedIcon: null
    });
  }

  forceUpdateHandler() {
    this.forceUpdate();
    this.setState({
      centerLat: '',
      centerLng: '',
      selectedIcon: null
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
          hideInterface={this.props.hideInterface}
          handleIconBounce={this.props.handleIconBounce}
          iconBounce={this.props.iconBounce}
          lat={this.props.coords.latitude}
          lng={this.props.coords.longitude}
          vehicles={this.props.vehicles}
          stops={this.props.stops}
          centerLat={this.state.centerLat}
          centerLng={this.state.centerLng}
          selectedIcon={this.state.selectedIcon}
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