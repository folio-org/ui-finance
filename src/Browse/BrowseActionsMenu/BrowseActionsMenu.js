import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Button,
  MenuSection,
  Icon,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import {
  FISCAL_YEAR_ROUTE,
  LEDGERS_ROUTE,
  GROUPS_ROUTE,
  FUNDS_ROUTE,
} from '../../common/const';

const BrowseActionsMenu = ({ location }) => {
  return (
    <MenuSection id="browse-actions">
      <IfPermission perm="ui-finance.fiscal-year.create">
        <Button
          id="clickable-newFiscalYear"
          data-testid="create-fiscal-year-button"
          to={{
            pathname: `${FISCAL_YEAR_ROUTE}/create`,
            search: location.search,
          }}
          buttonStyle="dropdownItem"
        >
          <Icon size="small" icon="plus-sign">
            <FormattedMessage id="ui-finance.browse.actions.newFiscalYear" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="ui-finance.ledger.create">
        <Button
          id="clickable-newLedger"
          data-testid="create-ledger-button"
          to={{
            pathname: `${LEDGERS_ROUTE}/create`,
            search: location.search,
          }}
          buttonStyle="dropdownItem"
        >
          <Icon size="small" icon="plus-sign">
            <FormattedMessage id="ui-finance.browse.actions.newLedger" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="ui-finance.group.create">
        <Button
          id="clickable-newGroup"
          data-testid="create-group-button"
          to={{
            pathname: `${GROUPS_ROUTE}/create`,
            search: location.search,
          }}
          buttonStyle="dropdownItem"
        >
          <Icon size="small" icon="plus-sign">
            <FormattedMessage id="ui-finance.browse.actions.newGroup" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="ui-finance.fund-budget.create">
        <Button
          id="clickable-newFund"
          data-testid="create-fund-button"
          to={{
            pathname: `${FUNDS_ROUTE}/create`,
            search: location.search,
          }}
          buttonStyle="dropdownItem"
        >
          <Icon size="small" icon="plus-sign">
            <FormattedMessage id="ui-finance.browse.actions.newFund" />
          </Icon>
        </Button>
      </IfPermission>
    </MenuSection>
  );
};

BrowseActionsMenu.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(BrowseActionsMenu);

