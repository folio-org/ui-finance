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
  FUNDS_ROUTE,
  GROUPS_ROUTE,
  LEDGERS_ROUTE,
} from '../../common/const';

const ACTIONS = [
  {
    id: 'clickable-newFiscalYear',
    testId: 'create-fiscal-year-button',
    perm: 'ui-finance.fiscal-year.create',
    route: FISCAL_YEAR_ROUTE,
    labelId: 'ui-finance.browse.actions.newFiscalYear',
  },
  {
    id: 'clickable-newLedger',
    testId: 'create-ledger-button',
    perm: 'ui-finance.ledger.create',
    route: LEDGERS_ROUTE,
    labelId: 'ui-finance.browse.actions.newLedger',
  },
  {
    id: 'clickable-newGroup',
    testId: 'create-group-button',
    perm: 'ui-finance.group.create',
    route: GROUPS_ROUTE,
    labelId: 'ui-finance.browse.actions.newGroup',
  },
  {
    id: 'clickable-newFund',
    testId: 'create-fund-button',
    perm: 'ui-finance.fund-budget.create',
    route: FUNDS_ROUTE,
    labelId: 'ui-finance.browse.actions.newFund',
  },
];

const BrowseActionsMenu = ({ location }) => (
  <MenuSection id="browse-actions">
    {ACTIONS.map(({ id, testId, perm, route, labelId }) => (
      <IfPermission key={id} perm={perm}>
        <Button
          id={id}
          data-testid={testId}
          to={{ pathname: `${route}/create`, search: location.search }}
          buttonStyle="dropdownItem"
        >
          <Icon size="small" icon="plus-sign">
            <FormattedMessage id={labelId} />
          </Icon>
        </Button>
      </IfPermission>
    ))}
  </MenuSection>
);

BrowseActionsMenu.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(BrowseActionsMenu);
