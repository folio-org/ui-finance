import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';
import _ from "lodash";
import queryString from 'query-string';
// Stripes Components
import SegmentedControl from '@folio/stripes-components/lib/SegmentedControl';
import Button from '@folio/stripes-components/lib/Button';
// Components and Pages
import Ledger from '../Ledger';
import FiscalYear from '../FiscalYear/FiscalYear';
import Fund from '../Fund/Fund';
// import Budget from '../Budget';
import css from './Main.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: ''
    }
    this.connectedLedger = props.stripes.connect(Ledger);
    this.connectedFiscalYear = props.stripes.connect(FiscalYear);
    this.connectedFund = props.stripes.connect(Fund);
    // this.connectedBudget = props.stripes.connect(Budget);
    this.handleActivate = this.handleActivate.bind(this);
  }

  handleActivate({ id }) {
    this.setState({
      activeTab: id,
    });
    if (id === 'ledger') {
      this.props.history.push(`${this.props.match.path}/ledger`);
    } else {
      this.props.history.push(`${this.props.match.path}/${id}`);
    }
  }
  
  render() {
    return (
      <div style={{width: '100%'}}>
        <div className={css.SegControl}>
          <SegmentedControl activeId={this.state.activeTab} onActivate={this.handleActivate}>
            <Button id="ledger">Ledger</Button>
            <Button id="fund">Fund</Button>
            <Button id="budget">Budget</Button>
            <Button id="fiscalyear">Fiscal Year</Button>
          </SegmentedControl>
          <br />
        </div>
        <Switch>
          <Route
            path={`${this.props.match.path}/ledger`}
            render={props => <this.connectedLedger
              stripes={this.props.stripes}
              mutator={this.props.mutator}
              resources={this.props.resources}
              handleActivate={this.handleActivate}
              {...props} />
            }
          />
          <Route
            path={`${this.props.match.path}/fiscalyear`}
            render={props => <this.connectedFiscalYear
              stripes={this.props.stripes}
              mutator={this.props.mutator}
              resources={this.props.resources}
              handleActivate={this.handleActivate}
              {...props} />
            }
          />
          <Route
            path={`${this.props.match.path}/fund`}
            render={props => <this.connectedFund
              stripes={this.props.stripes}
              mutator={this.props.mutator}
              resources={this.props.resources}
              handleActivate={this.handleActivate}
              {...props} />
            }
          />
          <Redirect exact from={`${this.props.match.path}`} to={`${this.props.match.path}/ledger`} />
        </Switch>
      </div>
    )
  }
}

export default Main;