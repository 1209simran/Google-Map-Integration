import React from "react";
import "./Map.css";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker
} from "react-google-maps";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyB7oN7PaZBwy2bAx99J9x4ukQcvSuILR10");
Geocode.enableDebug();
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      city: "",
      area: "",
      state: "",
      mapPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      }
    };
  }
  componentDidMount() {
    Geocode.fromLatLng(
      this.state.mapPosition.lat,
      this.state.mapPosition.lng
    ).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        console.log("city", city, area, state);

        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : ""
        });
      },
      error => {
        console.error(error);
      }
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.markerPosition.lat !== this.props.center.lat ||
      this.state.address !== nextState.address ||
      this.state.city !== nextState.city ||
      this.state.area !== nextState.area ||
      this.state.state !== nextState.state
    ) {
      return true;
    } else if (this.props.center.lat === nextProps.center.lat) {
      return false;
    }
  }

  getCity = addressArray => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };

  getArea = addressArray => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };

  getState = addressArray => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onInfoWindowClose = event => {};

  onPlaceSelected = place => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    this.setState({
      address: address ? address : "",
      area: area ? area : "",
      city: city ? city : "",
      state: state ? state : "",
      markerPosition: {
        lat: latValue,
        lng: lngValue
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue
      }
    });
  };

  onMarkerDragEnd = event => {
    console.log("event", event);
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng(),
      addressArray = [];
    Geocode.fromLatLng(newLat, newLng).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);
        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : "",
          markerPosition: {
            lat: newLat,
            lng: newLng
          },
          mapPosition: {
            lat: newLat,
            lng: newLng
          }
        });
      },
      error => {
        console.error(error);
      }
    );
  };
  render() {
    const AsyncMap = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap
          google={this.props.google}
          defaultZoom={this.props.zoom}
          defaultCenter={{
            lat: this.state.mapPosition.lat,
            lng: this.state.mapPosition.lng
          }}
        >
          <Autocomplete
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "16px",
              marginTop: "4px",
              marginBottom: "100px"
            }}
            onPlaceSelected={this.onPlaceSelected}
            types={["(regions)"]}
          />

          <Marker
            google={this.props.google}
            name={"Dolores park"}
            draggable={true}
            onDragEnd={this.onMarkerDragEnd}
            position={{
              lat: this.state.markerPosition.lat,
              lng: this.state.markerPosition.lng
            }}
          />
          <Marker />
          <InfoWindow
            onClose={this.onInfoWindowClose}
            position={{
              lat: this.state.markerPosition.lat + 0.0018,
              lng: this.state.markerPosition.lng
            }}
          >
            <div>
              <span style={{ padding: 0, margin: 0 }}>
                {this.state.address}
              </span>
            </div>
          </InfoWindow>
        </GoogleMap>
      ))
    );
    let map;
    if (this.props.center.lat !== undefined) {
      map = (
        <div>
          <div>
            <div>
              <AsyncMap
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB7oN7PaZBwy2bAx99J9x4ukQcvSuILR10&libraries=places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: this.props.height }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </div>

            <div className="form-group" style={{ marginTop: "50px" }}>
              <br></br>
              <label>City:</label>
              <br></br>
              <input
                type="text"
                name="city"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.city}
              />
            </div>
            <div className="form-group">
              <label>Area:</label>
              <br></br>
              <input
                type="text"
                name="area"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.area}
              />
            </div>
            <div className="form-group">
              <label>State:</label>
              <br></br>
              <input
                type="text"
                name="state"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.state}
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <br></br>
              <input
                type="text"
                name="address"
                className="form-control"
                onChange={this.onChange}
                readOnly="readOnly"
                value={this.state.address}
              />
            </div>
          </div>
        </div>
      );
    } else {
      map = <div style={{ height: this.props.height }} />;
    }
    return map;
  }
}
export default Map;
