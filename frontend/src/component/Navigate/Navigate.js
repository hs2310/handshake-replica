import React from 'react'
// import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import * as bs from 'react-bootstrap';
class Navigate extends React.Component {
  // constructor(props){
  //   super(props)
  // }
  render() {

    if (!cookie.load('cookie')) {
      return <Redirect to="/" />
    }
    else {
      return <div>
        <bs.Navbar bg="primary" variant="dark">
          <bs.Navbar.Brand href="/home">Handshake</bs.Navbar.Brand>
          <bs.Form inline>
            <bs.FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <bs.Button variant="outline-light">Search</bs.Button>
          </bs.Form>
          <bs.Nav className="mr-auto">
          <bs.Nav.Link href ="/nav">Jobs</bs.Nav.Link>
          <bs.Nav.Link href ="/nav">Events</bs.Nav.Link>
          <bs.Nav.Link href ="/nav">Students</bs.Nav.Link>
          <bs.Nav.Link href="/profile">Profile</bs.Nav.Link>
          </bs.Nav>
         
        </bs.Navbar>
      </div>
    }
  }
}
export default Navigate;