import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  PaneMenu,
  Button,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import { FISCAL_YEAR_ROUTE } from '../../common/const';

const FiscalYearsListLastMenu = () => {
  return (
    <IfPermission perm="ui-finance.fiscal-year.create">
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.addNew">
          {ariaLabel => (
            <Button
              id="clickable-newFiscalYear"
              aria-label={ariaLabel}
              to={`${FISCAL_YEAR_ROUTE}/create`}
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

export default FiscalYearsListLastMenu;
