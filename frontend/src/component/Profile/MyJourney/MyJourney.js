import React from 'react';
import axios from 'axios';

class MyJourney extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            update_journey: false,
            data: '',
            objective: ''
        }
        this.myJourneyHandler = this.myJourneyHandler.bind(this);
        this.educationChangeHandler = this.educationChangeHandler.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
    }
    componentDidMount() {
        let data = { id: '1' }
        axios.post("http://localhost:3001/studentData", data).then(res => {
            this.setState({
                data: res.data[0],
                objective: res.data[0].objective
            });
            console.log(this.state.data)

        }).catch(e => console.log(e));
    }
    myJourneyHandler = () => {
        if (this.state.update_journey === true)
            this.setState({
                update_journey: false
            });
        else {
            this.setState({
                update_journey: true
            });
        }
    }
    educationChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    updateInfo = (e) => {
        e.preventDefault();
        let data = this.state;
        data.sid = '1';
        console.log(this.state);
        axios.post("http://localhost:3001/UpdateJourney", data).then(res => alert(res.data));
        this.props.action();
        this.myJourneyHandler();
    }

    render() {
        let myJourney = null;
        if (this.state.update_journey === true) {
            myJourney = <div>
                <form onSubmit={this.updateInfo}>
                    <div>
                        <form>
                            <div className="form-group">
                                <textarea name="objective" placeholder="Enter your Journey" className="form-control" defaultValue={this.state.objective} onChange={this.educationChangeHandler}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Update</button>
                        </form>
                    </div>
                </form>
            </div>
        }
        else {
            myJourney = <div>{this.state.objective}</div>;
        }
        return <div>
            <button onClick={this.myJourneyHandler} className="btn btn-primary" style={{ float: "right" }} type="button">edit</button>
            <h4>My Journey</h4>
            {myJourney}
        </div>
    }
}
export default MyJourney;