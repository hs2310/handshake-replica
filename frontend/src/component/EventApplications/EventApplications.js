import React from 'react';
import Navigate from '../Navigate/Navigate';
import { Link } from 'react-router-dom';
import axios from 'axios';
class EventApplications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        }
    }
    async componentDidMount() {
        let data = {
            sid: localStorage.getItem("id")
        }
        await axios.post("http://54.86.64.9:3001/getAppliedEvents", data).then(res => {
            this.setState({
                events: res.data
            })
        })
    }
    render() {
        let eventList = this.state.events.map((i, index) => {
            return (
                <div key={index} className="card">
                    <div className="card-body">
                        <h5>{i.name}</h5>
                        <h6>{i.description}</h6>
                        <p className="card-text">{i.time}</p>
                        <p className="card-text">{i.date}</p>
                        <p className="card-text">{i.location}</p>
                    </div>
                </div>
            );
        });

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
                    <div className="col-md-12">
                        {eventList}
                    </div>
                </div>
            </div>
        </div>
    }
}
export default EventApplications;