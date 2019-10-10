import React, { Component } from "react";
import Maps from "./Maps";
class App extends Component {
  render() {
    return (
      <Maps center={{ lat: 18.5204, lng: 73.8567 }} height="500px" zoom={15} />
    );
  }
}

export default App;
