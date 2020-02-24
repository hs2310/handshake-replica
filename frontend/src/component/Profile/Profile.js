import React from 'react'
import axios from 'axios';
import Navigate from "../Navigate/Navigate"
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap';
class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      skills: '',
      education: '',
      experience: ''
    }
  }
  componentDidMount() {
    let data = {
      id: "1"
    }
    axios.post("http://localhost:3001/student", data).then(res => {
      this.setState({
        data: res.data[0],
        skills: res.data[1],
        education: res.data[2],
        experience: res.data[3]
      });
      console.log(res.data)
    }).catch(e => console.log(e));
  }
  render() {
    let style_box = { boxShadow: "1px 3px 5px grey" , padding:"2%"};
    if (!cookie.load('cookie')) {
      return <Redirect to="/" />
    }
    else {
      return <div>
        {/* <bs.Navbar bg="primary" variant="dark">
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

        {this.props.location.type} */}
        <Navigate />
        <Container style={{ marginTop: "5%" }}>
          <Row>
            <Col sm={4} style={style_box}>
              <button onClick={this.generalInfoHandler} className="btn btn-primary" style={{ float: "right" }} type="button">edit</button>
              {this.state.data.profile_pic}
              <h4>{this.state.data.name}</h4>
              {this.state.data.college}
            </Col>
            <Col sm={{span: 7, offset: 1}}  style={style_box}>
              <button onClick={this.generalInfoHandler} className="btn btn-primary" style={{ float: "right" }} type="button">edit</button>
              <h4>My Journey</h4>
              {this.state.data.objective}
            </Col>
          </Row>
          <Row>
            <Col sm={4} style={style_box}>
              <button onClick={this.generalInfoHandler} className="btn btn-primary" style={{ float: "right" }} type="button">edit</button>
              Contact Information<br/>
              {this.state.data.mob}<br />
              {this.state.data.email}
            </Col>
            <Col sm={{span: 7, offset: 1}} style={style_box}>
              <button onClick={this.generalInfoHandler} className="btn btn-primary" style={{ float: "right" }} type="button">edit</button>
              <h4>Education</h4>
              {this.state.education}
            </Col>
          </Row>
          <Row>
            <Col sm={4} >

            </Col>
            <Col sm={{span: 7, offset: 1}} style={style_box}>
              <button onClick={this.generalInfoHandler} className="btn btn-primary" style={{ float: "right" }} type="button">edit</button>
              <h4>Work & Volunteer Experience</h4>
              {this.state.experience}
            </Col>
          </Row>
        </Container>

        {/* {this.state.skills}
        {this.state.education}
        {this.state.experience} */}
      </div>
    }
  }
}
export default Profile;