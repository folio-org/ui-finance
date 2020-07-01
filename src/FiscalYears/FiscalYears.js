import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { IfPermission } from '@folio/stripes/core';

import { FISCAL_YEAR_ROUTE } from '../common/const';

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
            <CreateFiscalYear />
          </IfPermission>
        )}
      />
      <Route
        path={`${FISCAL_YEAR_ROUTE}/:id/edit`}
        render={() => (
          <IfPermission perm="ui-finance.fiacal-year.edit">
            <EditFiscalYear />
          </IfPermission>
        )}
      />
      <Route
        path={FISCAL_YEAR_ROUTE}
        render={() => (
          <IfPermission perm="ui-finance.fiscal-year.view">
            <FiscalYearsListContainer />
          </IfPermission>
        )}
      />
    </Switch>
  );
};

export default FiscalYears;
