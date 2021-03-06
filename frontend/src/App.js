import React, { Component } from 'react';
import './App.css';
import Main from './component/Main';
import {BrowserRouter} from 'react-router-dom';

//App Component
class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.store = this.props.store;
  // }
  render() {
    return (
      //Use Browser Router to route to different pages
      <BrowserRouter>
        <div>
          {/* App Component Has a Child Component called Main*/}
          <Main/>
        </div>
      </BrowserRouter>
    );
  }
}
//Export the App component so that it can be used in index.js
export default App;
