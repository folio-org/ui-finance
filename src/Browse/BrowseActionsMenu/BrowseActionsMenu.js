import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
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

const BrowseActionsMenu = ({ isTransferDisabled, location, onToggle, onTransfer }) => {
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

      <IfPermission perm="finance.transfers.item.post">
        <Button
          id="clickable-browse-transfer"
          data-testid="browse-transfer-button"
          buttonStyle="dropdownItem"
          disabled={isTransferDisabled}
          onClick={() => {
            onToggle();
            onTransfer();
          }}
        >
          <Icon size="small" icon="transfer">
            <FormattedMessage id="ui-finance.transaction.button.transfer" />
          </Icon>
        </Button>
      </IfPermission>
    </MenuSection>
  );
};

BrowseActionsMenu.propTypes = {
  isTransferDisabled: PropTypes.bool,
  onToggle: PropTypes.func,
  onTransfer: PropTypes.func,
  location: ReactRouterPropTypes.location.isRequired,
};

BrowseActionsMenu.defaultProps = {
  isTransferDisabled: false,
  onToggle: () => {},
  onTransfer: () => {},
};

export default withRouter(BrowseActionsMenu);
