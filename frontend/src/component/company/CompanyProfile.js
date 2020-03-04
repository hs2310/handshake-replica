import React from 'react';
// import cookie from 'react-cookies';
// import { useParams } from 'react-router-dom';
// import * as bs from 'react-bootstrap';
import {connect} from 'react-redux';
import axios from 'axios';
// import { logout } from '../../js/actions/index';

class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            name: 'HAR',
            description: 'S'
        }
    }
    // static propTypes = {
    //     match: PropTypes.object.isRequired,

    //   };
    componentDidMount(){     
        
        console.log(this.props.match.params);
        // const { match: { params } } = this.props;
        axios.post("http://localhost:3001/getCompanyDetails",this.props.match.params).then(
           res=>{ 
                console.log(res.data[0])   
            this.setState({
                name : res.data[0].name,
                description : res.data[0].descrption,
                email : res.data[0].email,
                location : res.data[0].location,
                description : res.data[0].description,
                mob : res.data[0].mob,
                profile_pic : res.data[0].profile_pic
            })
        })
    }
    render(){
        return <div>
            {this.props.match.params.id}<br/>
            {this.state.name}<br/>
            {this.state.description}<br/>
            {this.state.email}<br/>
            {this.state.location}<br />
            {this.state.mob} <br/>
            {this.state.profile_pic}
        </div>   
    }
}
const mapStateToProps = state => {
    return {
        id: state.rootReducer.id,
        jobs: state.jobReducer.jobs
    };
};

export default connect(mapStateToProps)(CompanyProfile);