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
class JobSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: false,
      displayJobs: {},
      apply: false
    }
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
      displayJobs: { ...this.props.jobs[i] }
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
    if(this.state.apply)
      applyForm = <ApplicationForm jobs={displayJobs}/>
    return <div>
      {/* <Navigate />
      <nav className="navbar navbar-expand-sm bg-light navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <Link className="nav-link" to="/jobSearch">Job Search</Link>
          </li>
          <li className="nav-item active">
            <Link className="nav-link" to="#">Applications</Link>
          </li>
        </ul>
      </nav> */}
      <Jobs/>
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
          <p className="card-text">{displayJobs.location}</p>
          <p className="card-text">{displayJobs.job_category}</p>
          <p className="card-text">{displayJobs.job_description}</p>
          <button type="button" onClick={() =>{this.setState({apply : true})}} className="btn btn-primary">Apply</button>
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