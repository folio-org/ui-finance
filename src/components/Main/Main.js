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
import Budget from '../Budget/Budget';
import css from './Main.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.connectedLedger = props.stripes.connect(Ledger);
    this.connectedFiscalYear = props.stripes.connect(FiscalYear);
    this.connectedFund = props.stripes.connect(Fund);
    this.connectedBudget = props.stripes.connect(Budget);
    this.connectedBudget = props.stripes.connect(Budget);
  }
  
  render() {
    return (
      <div style={{width: '100%'}}>
        <Switch>
          <Route
            path={`${this.props.match.path}/ledger`}
            render={props => <this.connectedLedger
              stripes={this.props.stripes}
              mutator={this.props.mutator}
              resources={this.props.resources}
              {...props} />
            }
          />
          <Route
            path={`${this.props.match.path}/fund`}
            render={props => <this.connectedFund
              stripes={this.props.stripes}
              mutator={this.props.mutator}
              resources={this.props.resources}
              {...props} />
            }
          />
          <Route
            path={`${this.props.match.path}/budget`}
            render={props => <this.connectedBudget
              stripes={this.props.stripes}
              mutator={this.props.mutator}
              resources={this.props.resources}
              {...props} />
            }
          />
          <Route
            path={`${this.props.match.path}/fiscalyear`}
            render={props => <this.connectedFiscalYear
              stripes={this.props.stripes}
              mutator={this.props.mutator}
              resources={this.props.resources}
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