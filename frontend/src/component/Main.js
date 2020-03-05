import React, { Component } from 'react';

//import Main from './components/Main';
// import {BrowserRouter} from 'react-router-dom';
import Home from './Home/Home';
import Login from './Login/Login';
import Logout from './Logout/Logout';
import Profile from './Profile/Profile'
// import Navigate from './Navigate/Navigate'
import Register from './Register/Register';
// import Jobs from './Jobs/Jobs'
import {Switch,Route} from 'react-router-dom';
import JobSearch from './JobSearch.js/JobSearch';
import CompanyProfile from './company/CompanyProfile';
import StudentApplication from './StudentApplication/StudentApplication'
//Main Component
class Main extends Component {
  render() {
    return (
        <div>
        {/*Render Different Component based on Route*/}
        <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/home" component={JobSearch}/>
        <Route path="/nav" component={Home}/>
        <Route path="/jobs" component={JobSearch}/>
        <Route path="/profile" component={Profile}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/logout" component={Logout}/>
        <Route path="/jobSearch" component={JobSearch}/>
        <Route path = "/displayCompany/:id" component={CompanyProfile} />
        <Route path = "/studentApplications" component={StudentApplication} />
        {/* <DisplayCompany/>
        </Route> */}
        {/* <Route path="/home" component={Home}/>
        <Route path="/delete" component={Delete}/>
        <Route path="/create" component={Create}/> */}
        </Switch>
    </div>
    );
  }
}
export default Main;
