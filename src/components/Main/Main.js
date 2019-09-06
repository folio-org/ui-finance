import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';

import {
  GROUPS_ROUTE,
  FISCAL_YEAR_ROUTE,
} from '../../common/const';

import Ledger from '../Ledger';
import FundsList from '../Fund';
import Budget from '../Budget/Budget';
import Groups from '../../Groups';
import FiscalYear from '../FiscalYear/FiscalYear';

class Main extends Component {
  static propTypes = {
    match: PropTypes.object,
    stripes: PropTypes.object,
    mutator: PropTypes.object,
    resources: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.connectedLedger = props.stripes.connect(Ledger);
    this.connectedFundsList = props.stripes.connect(FundsList);
  }

  render() {
    const { resources, mutator, match, stripes } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <Switch>
          <Route
            path={`${match.path}/ledger`}
            render={props => <this.connectedLedger
              stripes={stripes}
              mutator={mutator}
              resources={resources}
              {...props}
            />
            }
          />
          <Route
            path={`${match.path}/fund`}
            render={
              props => (
                <this.connectedFundsList
                  stripes={stripes}
                  mutator={mutator}
                  resources={resources}
                  {...props}
                />
              )
            }
          />
          <Route
            path={`${match.path}/budget`}
            render={
              props => (
                <Budget match={props.match} />
              )
            }
          />
          <Route
            path={GROUPS_ROUTE}
            component={Groups}
          />
          <Route
            path={FISCAL_YEAR_ROUTE}
            component={FiscalYear}
          />
          <Redirect exact from={`${match.path}`} to={`${match.path}/ledger`} />
        </Switch>
      </div>
    );
  }
}

export default Main;
