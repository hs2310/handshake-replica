import React from 'react'
// import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import * as bs from 'react-bootstrap';
class Navigate extends React.Component {
    render() {

        if (!cookie.load('cookie')) {
            return <Redirect to="/login" />
        }
        else {
            return <div>
                <bs.Navbar bg="primary" variant="dark">
    <bs.Navbar.Brand href="#home">Navbar</bs.Navbar.Brand>
    <bs.Nav className="mr-auto">
      <bs.Nav.Link href="#home">Home</bs.Nav.Link>
      <bs.Nav.Link href="#features">Features</bs.Nav.Link>
      <bs.Nav.Link href="#pricing">Pricing</bs.Nav.Link>
    </bs.Nav>
    <bs.Form inline>
      <bs.FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <bs.Button variant="outline-light">Search</bs.Button>
    </bs.Form>
  </bs.Navbar>
            </div>
        }
    }
}
export default Navigate;