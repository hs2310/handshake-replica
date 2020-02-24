import React from 'react'
// import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
// import * as bs from 'react-bootstrap';
import Navigate from '../Navigate/Navigate'
class Home extends React.Component {
  // constructor(props){
  //   super(props)
  // }
  render() {

    if (!cookie.load('cookie')) {
      return <Redirect to="/" />
    }
    else {
      return <div>
        

        <Navigate />
        <h1>Home Page!!!</h1>
      </div>
    }
  }
}
export default Home;