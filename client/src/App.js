import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './Home';
import ClientPage from './ClientPage';
import StockMarket from './StockMarket';

import './react-big-calendar.css';
import './App.css';

class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Home}/>
          <Route path="/clients/:clientId" component={ClientPage}/>
          <Route path="/market" component={StockMarket}/>
        </div>
      </Router>
    );
  }
}

export default App;
