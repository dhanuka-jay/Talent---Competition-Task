import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Header, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Container, Grid, Menu, Card, Image } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader);
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: "",
            statusVal: null,
            selectedSortBy: null
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.handleOrderbyChange = this.handleOrderbyChange.bind(this);
        this.getTotalJobCount = this.getTotalJobCount.bind(this);
    };

    init() {
        
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });
    }


    handlePaginationChange(e, value) {
        this.setState({ activePage: value.activePage });
        this.setState({ activeIndex: value.activePage });
    }

    componentDidMount() {
        this.init();
        this.getTotalJobCount();
        //this.loadData();
    };

    componentDidUpdate() {
        if (this.state.activeIndex === this.state.activePage) {
            this.loadData();
            this.setState({ activeIndex: "" });
        }
        else if (this.state.selectedSortBy !== this.state.sortBy.date) {
            this.loadData();
            this.setState({ selectedSortBy: this.state.sortBy.date });
        }
        
    }


    handleChange(e) {
        //this.setState({ statusVal: e.target.value });
        console.log(e.target.value);
    }


    handleOrderbyChange(e, selected) {
        this.setState(prevState => ({
            sortBy: {
                ...prevState.sortBy,
                date: selected.value
            }
        }));
    }

    getTotalJobCount() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: `${process.env.SERVICE_TALENT}/listing/listing/GetEmployerJobs`,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                if (res.myJobs) {
                    this.setState({ totalPages: Math.ceil(res.myJobs.length/6) });
                }
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        });
    }

    loadData(callback) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            //url: `${process.env.SERVICE_TALENT}/listing/listing/GetEmployerJobs`,
            url: `${process.env.SERVICE_TALENT}/listing/listing/getSortedEmployerJobs?activePage=${this.state.activePage}&sortbyDate=${this.state.sortBy.date}&showActive=${this.state.filter.showActive}&showClosed=${this.state.filter.showClosed}&showDraft=${this.state.filter.showDraft}&showExpired=${this.state.filter.showExpired}&showUnexpired=${this.state.filter.showUnexpired}`,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                if (res.myJobs) {
                    this.setState({ loadJobs: res.myJobs });
                }
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        });
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }


    
    render() {
        const status_options = [
            { key: 1, text: 'Active Jobs', value: 0 },
            { key: 2, text: 'Closed Jobs', value: 1 },
        ];

        const orderby_options = [
            { key: 1, text: 'Newest First', value: 'desc' },
            { key: 2, text: 'Oldest First', value: 'asc' },
        ];

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}> 
                <Container>
                    <h1>List of Jobs</h1>
                    <Header as='h5'>
                        <Icon name='filter' />
                        <Header.Content>
                            Filter{' '}
                            <Dropdown
                                inline
                                onChange={this.handleChange}
                                header='Choose Status'
                                options={status_options}
                                defaultValue={status_options[0].value}
                            />
                        </Header.Content>
                        <Icon name='calendar alternate' />
                        <Header.Content>
                            Sort By Date{' '}
                            <Dropdown
                                inline
                                onChange={this.handleOrderbyChange}
                                header='Choose Orderby'
                                options={orderby_options}
                                defaultValue={orderby_options[0].value}
                            />
                        </Header.Content>
                    </Header>
                    <Grid>
                        <Grid.Row columns={3} stretched>
                            {this.state.loadJobs.map((job) => (
                                <JobSummaryCard
                                    key={job.id}
                                    job={job}
                                />
                            ))}
                        </Grid.Row>
                    </Grid>
                    <Grid.Row>
                        <Pagination
                            activePage={this.state.activePage}
                            onPageChange={this.handlePaginationChange}
                            totalPages={this.state.totalPages}
                        />
                    </Grid.Row>
                </Container>
            </BodyWrapper>
        )
    }
}