import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { IfPermission } from '@folio/stripes/core';

import { FISCAL_YEAR_ROUTE } from '../common/const';
import NoPermissionsMessage from '../common/NoPermissionsMessage';

import { CreateFiscalYear } from './CreateFiscalYear';
import { EditFiscalYear } from './EditFiscalYear';
import { FiscalYearsListContainer } from './FiscalYearsList';

const FiscalYears = () => {
  return (
    <Switch>
      <Route
        path={`${FISCAL_YEAR_ROUTE}/create`}
        render={() => (
          <IfPermission perm="ui-finance.fiscal-year.create">
            {({ hasPermission }) => (hasPermission
              ? <CreateFiscalYear />
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
      <Route
        path={`${FISCAL_YEAR_ROUTE}/:id/edit`}
        render={() => (
          <IfPermission perm="ui-finance.fiscal-year.edit">
            {({ hasPermission }) => (hasPermission
              ? <EditFiscalYear />
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
      <Route
        path={FISCAL_YEAR_ROUTE}
        render={() => (
          <IfPermission perm="ui-finance.fiscal-year.view">
            {({ hasPermission }) => (hasPermission
              ? <FiscalYearsListContainer />
              : <NoPermissionsMessage />
            )}
          </IfPermission>
        )}
      />
    </Switch>
  );
};

export default FiscalYears;
