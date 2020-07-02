import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { FISCAL_YEAR_ROUTE } from '../common/const';
import CheckPermission from '../common/CheckPermission';

import { CreateFiscalYear } from './CreateFiscalYear';
import { EditFiscalYear } from './EditFiscalYear';
import { FiscalYearsListContainer } from './FiscalYearsList';

const FiscalYears = () => {
  return (
    <Switch>
      <Route
        path={`${FISCAL_YEAR_ROUTE}/create`}
        render={() => (
          <CheckPermission perm="ui-finance.fiscal-year.create">
            <CreateFiscalYear />
          </CheckPermission>
        )}
      />
      <Route
        path={`${FISCAL_YEAR_ROUTE}/:id/edit`}
        render={() => (
          <CheckPermission perm="ui-finance.fiscal-year.edit">
            <EditFiscalYear />
          </CheckPermission>
        )}
      />
      <Route
        path={FISCAL_YEAR_ROUTE}
        render={() => (
          <CheckPermission perm="ui-finance.fiscal-year.view">
            <FiscalYearsListContainer />
          </CheckPermission>
        )}
      />
    </Switch>
  );
};

export default FiscalYears;
