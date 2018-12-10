import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./SearchScreen.css";
import {Route, browserHistory} from 'react-router';
import Login from './Login.js'; 
import { ClipLoader } from "react-spinners";
import Popup from 'react-popup';
import ReactDom from 'react-dom';
import SweetAlert from 'sweetalert-react';

import "./popup.example.css";


class SearchScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      searchTxt: "",
      planets: [],
      searchPlanetData: [],
      loading: false
    };
  }
 
  getPlanetList() {
    this.setState({
      loading: true
    });
    document.getElementById("loderIndicator").style.display = "block";
    fetch("https://swapi.co/api/planets/")
      .then(response => response.json())
      .then(peopleData => {
        console.log(peopleData);
        document.getElementById("loderIndicator").style.display = "none";
        this.setState({
          loading: false
        });
        this.setState({
          planets: peopleData.results,
          searchPlanetData: peopleData.results
        });
      });
  }
  handleInputChange = e => {
    this.setState({ search: e.target.value });
    var array = this.state.searchPlanetData.filter(parseResult => {
      return (
        parseResult.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !==
        -1
      );
    });
    this.setState({ planets: array });
    this.render();
  };
  componentDidMount() {
    this.getPlanetList();
  }
  logoutUser(){
    localStorage.removeItem('username');
    browserHistory.replace('/SearchScreen')
    browserHistory.push('/')
  }
  
  planetDetail = e => {  
    var array = this.state.searchPlanetData.filter(parseResult => {
      return (
        parseResult.name.toLowerCase().indexOf(e.toLowerCase()) !==
        -1
      );
    });

    Popup.alert(<div><li><b>Name     -</b> {array[0].name}</li> 
    <li><b>Rotation_period</b> {array[0].rotation_period}
    </li> <li><b>Diameter    -</b> {array[0].diameter}</li>
     <li><b>Climate    -</b> {array[0].climate}</li>
     <li><b>Gravity    -</b> {array[0].gravity}</li>
     <li><b>Terrain    -</b> {array[0].terrain}</li>
     <li><b>Surface_water-</b> {array[0].surface_water}</li>
     <li><b>Population    -</b> {array[0].population}</li>
    </div>);
    //alert(array[0])
  };
  render() {
    //const {navigate} = this.props.navigation;
    return (
      <div class = "mainView">
 
    <Popup />,

        <header class = "header_Cont">
          <h1 class = "headrTitle"> Welcome {localStorage.getItem("username")} <a  href="javascript:void(0);" onClick={this.logoutUser} class="logout">Logout</a></h1>
        </header>
        <div class ="modal-content">
        <input
          type="text"
          placeholder="Search here..."
          ref={input => (this.searchTxt = input)}
          onChange={this.handleInputChange}
        />
        {this.state.planets.map(planet => {
          return <div class ="text-content" style={{ padding: 20 }}> <button class = "buttonCustom" onClick={ () =>this.planetDetail(planet.name)}>{planet.name} </button></div>;
        })}
        <div class="loader" id="loderIndicator" />
          </div>
        
      </div>
    );
  }
}

export default SearchScreen;
