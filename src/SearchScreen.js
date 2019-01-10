import React, { Component } from "react";
import "./SearchScreen.css";
import { Route, browserHistory } from 'react-router';
import Login from './Login.js';
import { ClipLoader } from "react-spinners";
import Popup from 'react-popup';
import ReactDom from 'react-dom';
import InfiniteScroll from 'react-infinite-scroller';

import "./popup.example.css";
import withWidth from "material-ui/utils/withWidth";
import { white } from "material-ui/styles/colors";
import { black } from "material-ui/styles/colors";


class SearchScreen extends React.Component {
  abortController = new window.AbortController();
  constructor() {
    super();
    this.state = {
      searchTxt: "",
      planets: [],
      searchPlanetData: [],
      loading: false,
      maxPopulation: 0,
      nextUrl: "https://swapi.co/api/planets/?search",
      previousUrl: "",
      searchString: "",
      searchCount: 0,
      sessionStartTime: 0,
    };
  }

  getPlanetList() {
    if (this.state.nextUrl == null) {
      this.state.nextUrl = "https://swapi.co/api/planets/?search=" + this.state.searchTxt
    }
    this.setState({
      loading: true
    });
    console.log('this.state.nextUrl')
    console.log(this.state.nextUrl)
    document.getElementById("loderIndicator").style.display = "block";
    this.abortController = new window.AbortController();
    fetch(this.state.nextUrl, {
      method: 'get',
      signal: this.abortController.signal,
    })
      .then(response => response.json())
      .then(peopleData => {
        console.log(peopleData);
        document.getElementById("loderIndicator").style.display = "none";
        this.setState({
          loading: false
        });

        this.setState({
          planets: [...this.state.planets, ...peopleData.results],
          searchPlanetData: peopleData.results,
          nextUrl: (peopleData.next == null ? "" : peopleData.next),
          previousUrl: peopleData.previous,
        });
        if (this.state.nextUrl == "") {
          document.getElementById("LoadMore").style.display = "none";
        } else {
          document.getElementById("LoadMore").style.display = "block";

        }
        var xValues = this.state.planets.map(function (o) {
          var value = parseInt((parseInt(o.population)));
          var newValue = (isNaN(value) ? 0 : value);
          return newValue;
        });
        this.setState({
          maxPopulation: Math.max(...xValues),
        });
      });
  }
  handleInputChange = e => {
    this.abortController.abort();
   
    if (localStorage.getItem('SearchCount')){
      this.state.searchCount = parseInt(localStorage.getItem('SearchCount'))
    }
    if (localStorage.getItem("username") != 'Luke Skywalker') {
      if (this.state.searchCount == 0){
        localStorage.setItem('SearchCount',0)
        localStorage.setItem('SessionStartTime',Date.now())
      }
      this.state.searchCount = this.state.searchCount + 1;
      localStorage.setItem('SearchCount',this.state.searchCount)
      let startTime = localStorage.getItem('SessionStartTime')
      console.log('startTime')
      console.log(startTime)
      var seconds = (Date.now() - parseInt(startTime)) / 1000;
       if ((this.state.searchCount>=5)) {
        console.log('seconds')
        console.log(seconds)
         if ((seconds/60) >= 1) {
          this.state.searchCount = 0;
          localStorage.setItem('SearchCount',0)
         }else{
          alert('You have exceede the limit.')
          return
         }
      }
    }
    document.getElementById("LoadMore").style.display = "none";
    this.state.planets = []
    this.state.nextUrl = "https://swapi.co/api/planets/?search=" + e.target.value
    this.state.searchTxt = e.target.value
    this.getPlanetList()
  };
  componentDidMount() {
    this.getPlanetList();
  }
  logoutUser() {
    localStorage.removeItem('LimitExceeded');
    localStorage.removeItem('username');
    localStorage.removeItem('SessionStartTime');
    localStorage.removeItem('SearchCount');

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
  loadMore() {
    if (this.state.nextUrl != null) {
      this.getPlanetList()
    } else {
      alert('No more record available')
    }
  }


  render() {
    return (
      <div class="mainView">
        <Popup/>
        <header class="header_Cont">
          <h1 class="headrTitle"> WELCOME, {localStorage.getItem("username").toUpperCase()} <a onClick={this.logoutUser} class="logout">LOGOUT</a></h1>
        </header>
        <div class="modal-content">
          <input
            type="text"
            placeholder="Search here..."
            ref={input => (this.searchTxt = input)}
            onChange={this.handleInputChange}
          />
          <div class="scroller">
            {this.state.planets.map(planet => {
              var value = parseInt(planet.population);
              var newValue = (isNaN(value) ? 0 : value);
              var percent = (newValue / this.state.maxPopulation) * 100;
              return <div id="chart" style={{
                width: '100%',
                height: '50px',
                border: '5px solid white',
                backgroundColor: 'white',
                textalign: 'left',
                alignItems: 'left',
                backgroundColor: '#e0e0eb',
              }} onClick={() => this.planetDetail(planet.name)} >
                <div style={{
                  width: percent + '%',
                  height: '50px',
                  backgroundColor: '#00bfff',
                  textalign: 'left',
                  alignItems: 'left',
                  textAlign: 'left'
                }}>
                  <label style={{
                    width: '100%',
                    textAlign: 'left',
                    paddingLeft: 0,
                    position: "relative",
                    top: '10px',
                    left: '0px',
                  }} class="buttonCustom">{planet.name} </label>
                </div>
              </div>;
            })}
          </div>
          <div> <button id="LoadMore" onClick={() => this.loadMore()} style={{
            width: '100px',
            height: '45px',
            bottom: '-10px',
            left: '0px',
            position: "absolute",
            backgroundColor: white,
            color: black,
            border: 'none',
            fontWeight: 'bold',
            display:'none'

            //outline: 'none'
          }}>{'LoadMore'}</button> </div>
          <div class="loader" id="loderIndicator" />
        </div>
      </div>
    );
  }
}

export default SearchScreen;