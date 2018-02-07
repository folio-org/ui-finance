import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import _ from "lodash";
import queryString from 'query-string';
// Stripes Components
import SegmentedControl from '@folio/stripes-components/lib/SegmentedControl';
import Button from '@folio/stripes-components/lib/Button';
// Components and Pages
import Ledger from '../Ledger';
// import Fund from '../Fund';
// import Budget from '../Budget';
import css from './Main.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'ledger'
    }
    this.connectedLedger = props.stripes.connect(Ledger);
    // this.connectedFund = props.stripes.connect(Fund);
    // this.connectedBudget = props.stripes.connect(Budget);
    this.handleActivate = this.handleActivate.bind(this);
  }

  handleActivate({ id }) {
    this.setState({
      activeTab: id,
    });
  }
  
  render() {
    return (
      <div style={{width: '100%'}}>
        <div className={css.SegControl}>
          <SegmentedControl className={css.test} activeId={this.state.activeTab} onActivate={this.handleActivate}>
            <Button id="ledger">Ledger</Button>
            <Button id="fund">Fund</Button>
            <Button id="budget">Budget</Button>
          </SegmentedControl>
          <br />
        </div>
        <Route
          path={`${this.props.match.path}/ledger`}
          render={props => <this.connectedLedger
            stripes={this.props.stripes}
            mutator={this.props.mutator}
            resources={this.props.resources}
            {...props} />
          }
        />
        {/*
        <Route
          path={`${this.props.match.path}/fund`}
          render={props => <this.connectedLedger
            stripes={this.props.stripes}
            mutator={this.props.mutator}
            resources={this.props.resources}
            {...props} />
          }
        />
        <Route
          path={`${this.props.match.path}/budget`}
          render={props => <this.connectedLedger
            stripes={this.props.stripes}
            mutator={this.props.mutator}
            resources={this.props.resources}
            {...props} />
          }
        /> */}
      </div>
    )
  }
}

export default Main;