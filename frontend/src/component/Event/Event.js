import React from 'react';
import Navigate from '../Navigate/Navigate';
import { Link } from 'react-router-dom';
import axios from 'axios';
class Events extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           posted_events: [],
           displayJobs : '',
           applied : ''
        }
    }
    async componentDidMount() {
        await axios.post("http://localhost:3001/getEvents").then(r => {
            this.setState({
                posted_events: r.data
            })
            console.log(this.state.posted_events)
        })
        this.setState({
            displayJobs: { ...this.state.posted_events[0] }
        })
    }
    display(i) {
        console.log(i)
        this.setState({
            applied : '',
            displayJobs: { ...this.state.posted_events[i] }
        })
    }
    onSubmit (e, eid){
        e.preventDefault();
        let data = {
            sid : localStorage.getItem('id'),
            eid : eid
        }
        axios.post("http://localhost:3001/registerEvent",data).then(res => {
            this.setState({
                applied : <div className = "alert alert-primary" style={{marginTop : '5%'}} >{res.data}</div>
            })
        })
        
    }
    render() {
        let displayJobs = this.state.displayJobs;
        let jobList = Object.keys(this.state.posted_events).map((item, i) => (
            <div className="card" key={i} onClick={() => { this.display(item) }}>
                <div className="card-body">
                    <h5 className="card-title">{this.state.posted_events[item].name}</h5>
                    {/* <h6 className="card-subtitle mb-2 text-muted">{this.state.posted_events[item].description}</h6> */}
                    <p className="card-text">{this.state.posted_events[item].time}</p>
                    <p className="card-text">{this.state.posted_events[item].date}</p>
                    {/* <p className="card-text">{this.state.posted_events[item].location}</p> */}
                    {/* <p className="card-text">{this.state.posted_events[item].eligibility}</p> */}
                </div>
            </div>
        ))
        // function AlertDismissibleExample() {
        //     const [show, setShow] = useState(true);
          
        //     if (show) {
        //       return (
                // <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                //   <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                //   <p>
                //     Change this and that and try again. Duis mollis, est non commodo
                //     luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                //     Cras mattis consectetur purus sit amet fermentum.
                //   </p>
                // </Alert>
        //       );
        //     }
        //     return <Button onClick={() => setShow(true)}>Show Alert</Button>;
        //   }
          
        return <div><Navigate />
            <nav className="navbar navbar-expand-sm bg-light navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/events">View Events</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link" to="/EventApplication">Applications</Link>
                    </li>
                </ul>
            </nav>

            <div className="container" style={{ marginTop: '1%' }}>
                <div className="row">
                    <div className="col-md-4">
                        {jobList}
                    </div>
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-2">{displayJobs.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{displayJobs.description}</h6>
                                <p className="card-text">{displayJobs.time}</p>
                                <p className="card-text">{displayJobs.date}</p>
                                <p className="card-text">{displayJobs.location}</p>
                                <p className="card-text">{displayJobs.eligibility}</p>
                                <p className="card-text">{displayJobs.eid}</p>
                                <form onSubmit={e => this.onSubmit(e, displayJobs.eid)}>
                                    <button className="btn btn-primary">Apply For Event</button>
                                </form>
                                {this.state.applied}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
export default Events;