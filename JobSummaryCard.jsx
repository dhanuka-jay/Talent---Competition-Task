import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Card, Pagination, Grid, Dropdown, Header, Icon, Button, Label } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 1,
            value: 0
        };
        this.selectJob = this.selectJob.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handlePaginationChange(e, activePage) {
        if (activePage) {
            this.setState({ activeIndex: activePage.activePage });
            //console.log(`${this.state.activeIndex}, ${activePage.activePage}`);
        }
        else {
            console.log("nothing...");
        }
    }


    handleUpdate(jobId) {
        //console.log(jobId);
        window.location.href = '/EditJob/'+jobId;
    }



    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        //url: `${process.env.SERVICE_TALENT}/listing/listing/closeJob`,
    }

    render() {
        //console.log(this.props.jobs);
        const { job } = this.props;

        return (
            <Grid.Column>
                <div className="ui card job-summary">
                    <div className="content">
                        <div className="header">{job.title}</div>
                        <a className="ui black right ribbon label">
                            <i aria-hidden="true" className="user icon"></i>
                            0
		                </a>
                        <div className="meta">{`${job.location.city},  ${job.location.country}`}</div>
                        <div className="description job-summary">{job.summary}</div>
                    </div>
                    <div className="extra content">
                        <div className="mini ui right floated buttons">
                            <button className="ui blue basic button">Close</button>
                            <button className="ui blue basic button" onClick={() => this.handleUpdate(job.id)}>Edit</button>
                            <button className="ui blue basic button">Copy</button>
                        </div>
                        <div className="mini ui left floated buttons">
                            <button className="ui red button">Expired</button>
                        </div>
                    </div>
                </div>
            </Grid.Column>
        )
    }
}