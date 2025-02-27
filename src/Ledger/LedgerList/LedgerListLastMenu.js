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

import { LEDGERS_ROUTE } from '../../common/const';

const LedgerListLastMenu = ({ location }) => {
  return (
    <MenuSection id="ledger-list-actions">
      <IfPermission perm="finance.ledgers.item.post">
        <FormattedMessage id="stripes-smart-components.addNew">
          {ariaLabel => (
            <Button
              id="clickable-newLedger"
              data-testid="create-ledger-button"
              aria-label={ariaLabel}
              to={{
                pathname: `${LEDGERS_ROUTE}/create`,
                search: location.search,
              }}
              buttonStyle="dropdownItem"
            >
              <Icon size="small" icon="plus-sign">
                <FormattedMessage id="stripes-smart-components.new" />
              </Icon>
            </Button>
          )}
        </FormattedMessage>
      </IfPermission>

      <IfPermission perm="ui-finance.fund-update-logs.view">
        <FormattedMessage id="ui-finance.actions.allocations.batch.logs">
          {ariaLabel => (
            <Button
              id="clickable-batch-allocation-logs"
              data-testid="view-batch-allocation-logs-button"
              aria-label={ariaLabel}
              to={{
                pathname: `${LEDGERS_ROUTE}/batch-allocations/logs`,
                state: { ...location },
              }}
              buttonStyle="dropdownItem"
            >
              <Icon size="small" icon="report">
                <FormattedMessage id="ui-finance.actions.allocations.batch.logs" />
              </Icon>
            </Button>
          )}
        </FormattedMessage>
      </IfPermission>
    </MenuSection>
  );
};

LedgerListLastMenu.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(LedgerListLastMenu);
