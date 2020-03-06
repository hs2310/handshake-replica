import React from 'react';
import Navigate from '../Navigate/Navigate';
import axios from 'axios';
import { Link } from 'react-router-dom';
class StudentDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            student : [],
            filtered_student : [],
            filter : []
        }
    }
    componentDidMount(){
        axios.get("http://localhost:3001/getAllStudents").then(r=>{
            this.setState({
                student : r.data,
                filtered_student : r.data
            })
        })
    }
    render(){
        let student = this.state.filtered_student.map((i, index) => {
            return (
                <div key={index} className="card">
                    <div className="card-body">
                    <Link to={"/displayStudent/" + i.sid}>{i.name}</Link>
                        <h6>{i.college}</h6>
                        <h6>{i.profile_pic}</h6> 
                        <h6>{i.city}</h6>
                    </div>
                </div>
            );
        })

    //     return <div>
    //         <Jobs />
    //         <div className="container" style={{marginTop : "5%"}}>
    //         {application} 
    //         </div>
    //    </div>
        return <div>
            <Navigate />
            <div className="container">
                <div className="row">
                    <div className="col-md-2">
                        Filter
                    </div>
                    <div className="col=md-10" style={{width : "80%"}}>
                        {student}
                    </div>
                </div>
            </div>
        </div>
    }
}
export default StudentDetails;