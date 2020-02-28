import React, { Component } from 'react';

//import Main from './components/Main';
// import {BrowserRouter} from 'react-router-dom';
import Home from './Home/Home';
import Login from './Login/Login';
import Profile from './Profile/Profile'
import Navigate from './Navigate/Navigate'
import Register from './Register/Register';
import {Switch,Route} from 'react-router-dom';

//Main Component
class Main extends Component {
  render() {
    return (
        <div>
        {/*Render Different Component based on Route*/}
        <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/home" component={Navigate}/>
        <Route path="/nav" component={Home}/>
        <Route path="/profile" component={Profile}/>
        <Route exact path="/register" component={Register}/>
        {/* <Route path="/home" component={Home}/>
        <Route path="/delete" component={Delete}/>
        <Route path="/create" component={Create}/> */}
        </Switch>
    </div>
    );
  }
}
export default Main;
