import React from 'react'
import axios from 'axios';
import Navigate from "../Navigate/Navigate"
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Container, Row, Col } from 'react-bootstrap';
import Experience from './experience/experience';
import Education from './Education/Education';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import ContactInfo from './ContactInfo/ContactInfo'
import MyJourney from './MyJourney/MyJourney';
import SkillSet from './SkillSet/SkillSet';
class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
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
    this.myJourneyHandler = this.myJourneyHandler.bind(this);
  }
  update= () =>{
    let data = {
      id: "1"
    }
    axios.post("http://localhost:3001/studentData", data).then(res => {
      this.setState({
        data: res.data[0]
      });
      console.log(this.state.data)
      
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
  
 
  componentDidMount() {
     this.update();
  }
  render() {
    let style_box = { boxShadow: "1px 3px 5px grey", padding: "2%" };
    
    if (!cookie.load('cookie')) {
      return <Redirect to="/" />
    }
    else {
      return <div>
        <Navigate />
        <Container style={{ marginTop: "5%" }}>
          <Row>
            <Col sm={4} style={style_box}>
              <GeneralInfo action = {this.update} />  
            </Col>
            <Col sm={{ span: 7, offset: 1 }} style={style_box}>
              <MyJourney action={this.update}/>
            </Col>
          </Row>
          <Row>
            <Col sm={4} style={style_box}>
              <ContactInfo action={this.update}/>
            </Col>
            <Col sm={{ span: 7, offset: 1 }} style={style_box}>
            <Education education  = {this.state.education} action = {this.update} />
            </Col>
          </Row>
          <Row>
            <Col sm={4} style={style_box}>
              <SkillSet action ={this.update}/>
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