import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';

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
    axios.all([axios.get('/api/vehicles/'), axios.get('/api/stops/')]).then(
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

  /* callApi = async () => {
    const response = await fetch('/api/vehicles/');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };
 */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Bussd</h1>
        </header>
        <p className="App-intro">This is bussd.</p>
        <p />
      </div>
    );
  }
}

export default App;
