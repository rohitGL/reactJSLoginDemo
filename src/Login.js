import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";
import { createStackNavigator, createAppContainer } from 'react-navigation';
import SearchScreen from './SearchScreen.js'; 
import {Route, browserHistory} from 'react-router';


export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleEmail(text) {
    this.setState({email: text.target.value})
}
handlePassword(text) {
    this.setState({password: text.target.value})
}
componentWillMount() {
  localStorage.removeItem("username")
  if (localStorage.getItem('username')) {
     browserHistory.push('/Searchscreen')
  }
}
  handleSubmit = event => {
    document.getElementById("loderIndicator").style.display = "block";
    event.preventDefault();
    const { email, password } = this.state;
  fetch("https://swapi.co/api/people/").then(response => response.json()).then(peopleData =>{
    if (this.validateUser(peopleData)) {
      document.getElementById("loderIndicator").style.display = "none";

      localStorage.setItem('username', email);
      browserHistory.push('/Searchscreen')
  }
  else {
    document.getElementById("loderIndicator").style.display = "none";
      alert('Enter correct credential');
      
  }
  })
  }
  validateUser(peopleData) {
    const { email, password } = this.state;
    for (var i = 0; i < peopleData.results.length; i++) {
        if (peopleData.results[i].name == email && peopleData.results[i].birth_year == password) {
            return true
        }
    }
    return false
}
  handleLoginClick = e => {
    e.preventDefault()
    const { email, password } = this.state;
    if (email.length <= 0) {
        alert('username cannot be empty');
    }
    else if (password.length <= 0) {
        alert('password cannot be empty');
    }else{
      this.handleSubmit(e)
    }
  }

  render() {
    return (
      <div >
        <form onSubmit={this.handleSubmit}>
        <div class="container">
      <header className="header">
         <h1 className="App-title">SIGN IN</h1>
      </header>
      <label for="uname"><b>Username</b></label>
      <input type="text" placeholder="Username" required value={this.state.email} onChange={(text)=>{this.handleEmail(text)}} />
      <label for="psw"><b>Password</b></label>
      <input type="password" placeholder="Password" name="psw" required value={this.state.password} onChange={(text)=>{this.handlePassword(text)}} />
      <button  onClick={this.handleLoginClick} >Login</button>
    </div>
    <div class="loader" id="loderIndicator"></div>
    </form>
      </div>
    );
  }
}