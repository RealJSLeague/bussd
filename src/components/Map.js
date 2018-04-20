import React, { Component } from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
  } from "react-google-maps";
  import {geolocated} from 'react-geolocated';

class Map extends Component {

render() { 
const MapWithAMarker = withScriptjs(withGoogleMap(props =>
  
    <GoogleMap
      defaultZoom={16}
      defaultCenter={{lat:this.props.coords.latitude,lng:this.props.coords.longitude}}
      
    >
      <Marker
        position={{lat:this.props.coords.latitude,lng:this.props.coords.longitude}}
        
      />
    </GoogleMap>
));

        
return (
  !this.props.isGeolocationAvailable
      ? <div>Your browser does not support Geolocation</div>
      : !this.props.isGeolocationEnabled
        ? <div>Geolocation is not enabled</div>
        : this.props.coords
          ? <div> 
            {/* <table>
            <tbody>
              <tr><td>latitude</td><td>{this.props.coords.latitude}</td></tr>
              <tr><td>longitude</td><td>{this.props.coords.longitude}</td></tr>
            </tbody>          
          </table> */}
         
          <MapWithAMarker
               googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCXdLMabpElbXEYvWy9yZSj9VRf0dpFMmo&v=3.exp&libraries=geometry,drawing,places"
               loadingElement={<div style={{ height: '100%' }} />}
               containerElement={<div style={{ height: '500px',width: '500px' }} />}
               mapElement={<div style={{ height: '100%' }} />}
           />
           </div>
            
          : <div>Getting the location data&hellip; </div>
     
      
);
   }
};
export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(Map);