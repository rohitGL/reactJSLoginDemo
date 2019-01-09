import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router'
import logo from './logo.svg';
import SearchScreen from './SearchScreen.js'; 
import Login from './Login.js'; 

 
import './App.css';
const LoginScreen = () => (
	<Login />
  );
const SearchPageScreen = () => (
	<SearchScreen/>
  );
class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <div className="App">
          <Route path='/' component={LoginScreen} />
          < Route path='/SearchScreen' component={SearchPageScreen}  />
        </div>
      </Router>
    );
  }
}

export default App;
