import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  PaneMenu,
  Button,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import { FUNDS_ROUTE } from '../../common/const';

const FundsListLastMenu = ({ location }) => {
  return (
    <IfPermission perm="finance.funds.item.post">
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.addNew">
          {ariaLabel => (
            <Button
              id="clickable-newFund"
              aria-label={ariaLabel}
              to={{
                pathname: `${FUNDS_ROUTE}/create`,
                search: location.search,
              }}
              buttonStyle="primary"
              marginBottom0
            >
              <FormattedMessage id="stripes-smart-components.new" />
            </Button>
          )}
        </FormattedMessage>
      </PaneMenu>
    </IfPermission>
  );
};

FundsListLastMenu.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(FundsListLastMenu);
