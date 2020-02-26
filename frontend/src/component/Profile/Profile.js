import React from 'react'
import axios from 'axios';
import Navigate from "../Navigate/Navigate"
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap';
import Experience from './experience/experience';
import Education from './Education/Education';
class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: '',
      skills: '',
      education: [],
      experience: [],
      update_general_info: false,
      update_my_Journey:  false,
      update_education: false,
      update_contact: false,
      update_experience: false,
      dob: ''
    };
    this.generalInfoHandler = this.generalInfoHandler.bind(this);
    this.myJourneyHandler = this.myJourneyHandler.bind(this);
    this.contactInfoHandler = this.contactInfoHandler.bind(this);
  }
  update= () =>{
    let data = {
      id: "1"
    }
    axios.post("http://localhost:3001/studentData", data).then(res => {
      this.setState({
        data: res.data[0]
      });
      let dob = this.state.data.dob;
      dob = dob.split('-')
      dob = dob[1] + '-' + dob[2].slice(0, 2) + '-' + dob[0]
      this.setState({
        dob: dob
      })
      
    }).catch(e => console.log(e));
    axios.post("http://localhost:3001/studentSkills", data).then(res => {
      this.setState({
        skills : res.data[0]
      });
    }).catch(e => console.log(e));
    axios.post("http://localhost:3001/studentEducation", data).then(res => {
      this.setState({
        education : res.data
      });
    }).catch(e => console.log(e));
    axios.post("http://localhost:3001/studentExperience", data).then(res => {
    // this.state.experience.push(res.data)  
    this.setState({
        experience : res.data
      });      
    }).catch(e => console.log(e));
  }
  generalInfoHandler = () => {
    if (this.state.update_general_info === true)
      this.setState({
        update_general_info: false
      });
    else {
      this.setState({
        update_general_info: true
      });
    }
  }
  myJourneyHandler = () => {
    if (this.state.update_my_Journey === true)
      this.setState({
        update_my_Journey: false
      });
    else {
      this.setState({
        update_my_Journey: true
      });
    }
  }
  
  contactInfoHandler = () =>{
    if (this.state.update_contact === true)
      this.setState({
        update_contact: false
      });
    else {
      this.setState({
        update_contact: true
      });
    } 
  }
 
  componentDidMount() {
    this.update();
  }
  render() {
    let style_box = { boxShadow: "1px 3px 5px grey", padding: "2%" };
    let generalInfo =null;
    let myJourney = null;
    let contact = null;
    

    if (this.state.update_general_info === true) {
      generalInfo = <div>
        <h4>Update General Info</h4>
        <form>
          <div className="form-group">
            <input type="text" name="name" placeholder="Enter your Name" className="form-control" />
          </div>
          <div className="form-group">
            <select name="college" onChange={this.selecthandleChange} className="form-control">
              <option value=""></option>
              <option value="San Jose State University">San Jose State University</option>
              <option value="Santa Clara University">Santa Clara University</option>
              <option value="University of California Berkley">University of California Berkley</option>
            </select>
          </div>
          <div className="form-group">
            <input type="date" name="date" placeholder="Select Date" className="form-control" />
          </div>
          <button type = "button" className="btn btn-primary">Update</button>  
        </form>
      </div>
    }
    else {
      generalInfo = <div>{this.state.data.profile_pic}<h4>{this.state.data.name}</h4>{this.state.data.college}<br />{this.state.dob}</div>;
    }
    if (this.state.update_my_Journey === true) {
      myJourney = <div>
        <h4>Update My Journey</h4> 
        <form>
          <div className="form-group">
            <textarea name="journey" placeholder="Enter your Journey" className="form-control"></textarea>
          </div>
          <button type = "button" className="btn btn-primary">Update</button>
        </form>
      </div>
    }else{
      myJourney = <div><h4>My Journey</h4> {this.state.data.objective}</div>
    }
    
    if(this.state.update_contact === true){
      contact = <div>
        <h4>Update Contact Information</h4>
        <form>
          <div className="form-group">
            <input type="mob" name="mob" placeholder="Enter your phone number" className="form-control"/>
          </div>
          <div className="form-group">
            <input type="email" name="email" placeholder="Enter your email" className="form-control"/>
          </div>
          <button type = "button" className="btn btn-primary">Update</button>
        </form>
      </div>
    }
    else{
      contact = <div> <h4>Contact Information</h4> {this.state.data.mob}<br/> {this.state.data.email}</div>
    }
    
    if (!cookie.load('cookie')) {
      return <Redirect to="/" />
    }
    else {
      return <div>
        <Navigate />
        <Container style={{ marginTop: "5%" }}>
          <Row>
            <Col sm={4} style={style_box}>
              <button onClick={this.generalInfoHandler} className="btn btn-primary" style={{ float: "right" }} type="button">edit</button>
              {generalInfo}
            </Col>
            <Col sm={{ span: 7, offset: 1 }} style={style_box}>
              <button onClick={this.myJourneyHandler} className="btn btn-primary" style={{ float: "right" }} type="button">edit</button>
              {myJourney}
            </Col>
          </Row>
          <Row>
            <Col sm={4} style={style_box}>
              <button onClick={this.contactInfoHandler} className="btn btn-primary" style={{ float: "right" }} type="button">edit</button>
             {contact}
            </Col>
            <Col sm={{ span: 7, offset: 1 }} style={style_box}>
            <Education education  = {this.state.education} action = {this.update} />
            </Col>
          </Row>
          <Row>
            <Col sm={4} >

            </Col>
            <Col sm={{ span: 7, offset: 1 }} style={style_box}>
              <Experience experience  = {this.state.experience} action = {this.update} />
              
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