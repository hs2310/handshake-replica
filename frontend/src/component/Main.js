import React, { Component } from 'react';

//import Main from './components/Main';
// import {BrowserRouter} from 'react-router-dom';
import Login from './Login/Login';
import Navigate from './Navigate/Navigate'
import Register from './Register/Register';
import {Route} from 'react-router-dom';
//Main Component
class Main extends Component {
  render() {
    return (
        <div>
        {/*Render Different Component based on Route*/}
        <Route path="/" component={Navigate}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
        {/* <Route path="/home" component={Home}/>
        <Route path="/delete" component={Delete}/>
        <Route path="/create" component={Create}/> */}

    </div>
    );
  }
}
export default Main;
