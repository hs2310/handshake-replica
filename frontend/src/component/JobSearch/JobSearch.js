import React from 'react'
// import axios from 'axios';
// import cookie from 'react-cookies';
// import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
// import Navigate from '../Navigate/Navigate';
import { getJobs } from '../../js/actions/job-action';
import { connect } from 'react-redux';
import ApplicationForm from './ApplicationForm';
import Jobs from '../Jobs/Jobs';
import axios from 'axios';
class JobSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: false,
      displayJobs: {},
      apply: ''
    }
    this.checkApplied = this.checkApplied.bind(this)
  }
  async componentDidMount() {
    await this.props.getJobs();
    console.log("JOBS " + this.props.jobs);
    this.setState({
      displayJobs: { ...this.props.jobs[0] }
    })
  }
  display(i) {
    console.log(i)
    this.setState({
      apply : '',
      displayJobs: { ...this.props.jobs[i] }
    })
  }
  checkApplied(jid){
    
    let data = {
      jid : jid,
      sid :  localStorage.getItem('id')
    }
    axios.post("http://localhost:3001/checkapplied", data).then(res => {
      this.setState({
        apply : res.data
      })
    })
  }
  render() {
    let applyForm = null;

    let displayJobs = this.state.displayJobs;
    let jobList = Object.keys(this.props.jobs).map((item, i) => (
      <div className="card" key={i} onClick={() => { this.display(item) }}>
        <div className="card-body">
          <h5 className="card-title">{this.props.jobs[item].title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{this.props.jobs[item].name}</h6>
          <p className="card-text">{this.props.jobs[item].location}</p>
          <p className="card-text">{this.props.jobs[item].job_category}</p>
        </div>
      </div>

    ))
    if (this.state.apply === true)
      applyForm = <ApplicationForm jobs={displayJobs} />
    else if(this.state.apply === false)
      applyForm = <div className="alert alert-primary">Already Applied!!</div>
    return <div>
      
      <Jobs />
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-6">Filter</div>
            <div className="col-md-6">Filter</div>
          </div>
          <div className="row">
            <div className="col-md-4">
              {jobList}
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{displayJobs.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    <Link to={"/displayCompany/" + displayJobs.cid}>{displayJobs.name}</Link>
                  </h6>
                  <p className="card-text">{displayJobs.salary}</p>
                  <p className="card-text">{displayJobs.location}</p>
                  <p className="card-text">{displayJobs.job_category}</p>
                  <p className="card-text">{displayJobs.job_description}</p>
                  <button type="button" onClick={() => this.checkApplied(displayJobs.jid)} className="btn btn-primary">Apply</button>
                  {applyForm}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  }
}
const mapStateToProps = state => {
  return {
    id: state.rootReducer.id,
    jobs: state.jobReducer.jobs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getJobs: rootReducer => dispatch(getJobs(rootReducer))
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(JobSearch);
// export default JobSearch;