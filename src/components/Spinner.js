import React, { Component } from 'react';

export default class Spinner extends Component {
  render() {
    return (
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
    );
  }
}
