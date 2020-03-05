import React from 'react';
import Jobs from '../Jobs/Jobs';
import axios from 'axios';
class StudentApplication extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            application : []
        }
    }
    async componentDidMount (){
        //get applied Jobs
        let data = {
            sid : 1
        }
        await axios.post("http://localhost:3001/getApplicaion",data).then(r =>{
            this.setState({
                application : r.data
            })
            console.log(this.state.application[0].jid+"\n"+r.data[0].name)
        })
    }
    render(){
        // let applications = Object.keys(this.state.application).map(function (key){
        //     var item = <div>
        //         {this.state.application[key].name}
        //     </div>
        //     return item
        // })
         let application = this.state.application.map((i, index) => {
            return (
                <div key={index} className="card">
                    <div className="card-body">
                        <h5>{i.title}</h5>
                        <h6>{i.name}</h6>
                        <h6>STATUS : {i.status}</h6> 
                    </div>
                </div>
            );
        })

        return <div>
            <Jobs />
            <div className="container" style={{marginTop : "5%"}}>
            {application} 
            </div>
       </div>
    }
}
export default StudentApplication;