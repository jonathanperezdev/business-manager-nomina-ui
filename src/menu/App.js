import React, { Component } from 'react';
import 'css/App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Nomina from 'components/nomina/Nomina';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/nomina' exact={true} component={Nomina}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
