import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { FISCAL_YEAR_ROUTE } from '../common/const';

import { CreateFiscalYear } from './CreateFiscalYear';
import { EditFiscalYear } from './EditFiscalYear';
import { FiscalYearsListContainer } from './FiscalYearsList';

const FiscalYears = () => {
  return (
    <Switch>
      <Route
        path={`${FISCAL_YEAR_ROUTE}/create`}
        component={CreateFiscalYear}
      />
      <Route
        path={`${FISCAL_YEAR_ROUTE}/:id/edit`}
        component={EditFiscalYear}
      />
      <Route
        path={FISCAL_YEAR_ROUTE}
        component={FiscalYearsListContainer}
      />
    </Switch>
  );
};

export default FiscalYears;
