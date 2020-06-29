import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';

import { FINANCE_NAVIGATION_TABS } from './constants';

const FinanceNavigation = ({ history, match: { path } }) => {
  const getTabStyle = tabId => (path.includes(`/finance/${tabId}`) ? 'primary' : 'default');
  const goToTab = (tabId) => history.push(`/finance/${tabId}`);

  return (
    <ButtonGroup
      fullWidth
      data-test-finance-navigation
    >
      <IfPermission perm="ui-finance.fiscal-year.view">
        <Button
          onClick={() => goToTab(FINANCE_NAVIGATION_TABS.FISCAL_YAER)}
          buttonStyle={getTabStyle(FINANCE_NAVIGATION_TABS.FISCAL_YAER)}
          data-test-finance-navigation-fiscalyear
        >
          <FormattedMessage id="ui-finance.fiscalyear" />
        </Button>
      </IfPermission>
      <IfPermission perm="ui-finance.ledger.view">
        <Button
          onClick={() => goToTab(FINANCE_NAVIGATION_TABS.LEDGER)}
          buttonStyle={getTabStyle(FINANCE_NAVIGATION_TABS.LEDGER)}
          data-test-finance-navigation-ledger
        >
          <FormattedMessage id="ui-finance.ledger" />
        </Button>
      </IfPermission>
      <IfPermission perm="ui-finance.group.view">
        <Button
          onClick={() => goToTab(FINANCE_NAVIGATION_TABS.GROUPS)}
          buttonStyle={getTabStyle(FINANCE_NAVIGATION_TABS.GROUPS)}
          data-test-finance-navigation-group
        >
          <FormattedMessage id="ui-finance.group" />
        </Button>
      </IfPermission>
      <IfPermission perm="ui-finance.fund-budget.view">
        <Button
          onClick={() => goToTab(FINANCE_NAVIGATION_TABS.FUND)}
          buttonStyle={getTabStyle(FINANCE_NAVIGATION_TABS.FUND)}
          data-test-finance-navigation-fund
        >
          <FormattedMessage id="ui-finance.fund" />
        </Button>
      </IfPermission>
    </ButtonGroup>
  );
};

FinanceNavigation.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(FinanceNavigation);
