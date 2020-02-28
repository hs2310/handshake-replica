import React from 'react';
import axios from 'axios';

class SkillSet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            update_skill: false,
            skillSet: [],
            skill: [],
            not_skill: [],
            selectSkill: ''
        }
        this.skillHandler = this.skillHandler.bind(this);
        this.educationChangeHandler = this.educationChangeHandler.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
    }
    update = () => {
        
        let data = { sid: '1' }
        axios.post("http://localhost:3001/studentSkills", data).then(res => {
            this.setState({
                skillSet: res.data,
            });
            console.log(this.state.skillSet)
        })
        console.log(this.state.skillSet)
        axios.post("http://localhost:3001/getSkills", data).then(res => {
            this.setState({
                skill: res.data
            });

            console.log(this.state.skill)

        })
    }
    componentDidMount() {
        this.update()
    }
    skillHandler = () => {
        if (this.state.update_skill === true)
            this.setState({
                update_skill: false
            });
        else {
            this.setState({
                update_skill: true
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
        let flag = 0;
        this.state.skillSet.forEach(x => {
            console.log(x)
            console.log(data.selectSkill)
            if (x.skid === Number(data.selectSkill)) {
                flag = 1;
            }
        })
        if (flag === 1)
            alert("Skill already exists")
        else {
            console.log(this.state);
            axios.post("http://localhost:3001/UpdateSkill", data).then(res => console.log(res.data));
            this.update();
            this.props.action();
            this.skillHandler();
        }
    }
    deleteSkill = (id) => {
        let data = { "id": id }
        axios.post("http://localhost:3001/DeleteSkill", data).then(res => alert(console.log.data));
        this.update();
        this.props.action();
        this.skillHandler();
    }
    render() {
        let skill = null;

        if (this.state.update_skill === true) {
            skill = <div>
                <div>{this.state.skillSet.map(item => <div key={item.id}>{item.name}<button onClick={() => { this.deleteSkill(item.id) }}>X</button></div>)}</div>
                <form onSubmit={this.updateInfo}>
                    <div className="form-group">
                        <select name="selectSkill" className="form-control" onChange={this.educationChangeHandler}>
                            <option value=""></option>
                            {this.state.skill.map(item =>
                                <option key={item.skid} value={item.skid}>{item.name}</option>
                            )
                            }
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
            </div>
        }
        else {
            skill = <div>{this.state.skillSet.map(item => <div key={item.id}>{item.name}</div>)}</div>
        }
        return <div>
            <button onClick={this.skillHandler} className="btn btn-primary" style={{ float: "right" }} type="button">edit</button>

            <h4>Skill Set</h4>

            {skill}
        </div>
    }
}
export default SkillSet;