import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  PaneMenu,
  Button,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import { LEDGERS_ROUTE } from '../../common/const';

const LedgerListLastMenu = () => {
  return (
    <IfPermission perm="finance.ledgers-list.item.post">
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.addNew">
          {ariaLabel => (
            <Button
              id="clickable-newLedger"
              aria-label={ariaLabel}
              to={`${LEDGERS_ROUTE}/create`}
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

export default LedgerListLastMenu;
