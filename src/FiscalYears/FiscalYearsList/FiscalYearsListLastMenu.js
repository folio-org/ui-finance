import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router';

import {
  PaneMenu,
  Button,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import { FISCAL_YEAR_ROUTE } from '../../common/const';

const FiscalYearsListLastMenu = () => {
  const location = useLocation();

  return (
    <IfPermission perm="finance.fiscal-years.item.post">
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.addNew">
          {ariaLabel => (
            <Button
              id="clickable-newFiscalYear"
              aria-label={ariaLabel}
              to={{
                pathname: `${FISCAL_YEAR_ROUTE}/create`,
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

export default FiscalYearsListLastMenu;
