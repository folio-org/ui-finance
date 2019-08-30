import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';
// Components and Pages
import Ledger from '../Ledger';
import FiscalYear from '../FiscalYear/FiscalYear';
import { FundsList } from '../Fund';
import Budget from '../Budget/Budget';

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
    this.connectedFiscalYear = props.stripes.connect(FiscalYear);
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
            path={`${match.path}/budget/`}
            render={
              props => (
                <Budget
                  stripes={stripes}
                  mutator={mutator}
                  resources={resources}
                  {...props}
                />
              )
            }
          />
          <Route
            path={`${match.path}/fiscalyear`}
            render={props => <this.connectedFiscalYear
              stripes={stripes}
              mutator={mutator}
              resources={resources}
              {...props}
            />
            }
          />
          <Redirect exact from={`${match.path}`} to={`${match.path}/ledger`} />
        </Switch>
      </div>
    );
  }
}

export default Main;
