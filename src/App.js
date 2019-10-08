import React, { Component } from "react";
import Map from "./Maps";
class App extends Component {
  render() {
    return (
      <Map
        google={this.props.google}
        center={{ lat: 18.5204, lng: 73.8567 }}
        height="500px"
        zoom={15}
      />
    );
  }
}

export default App;
