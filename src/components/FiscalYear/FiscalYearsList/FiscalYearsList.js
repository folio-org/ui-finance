import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  SearchAndSort,
  makeQueryFunction,
} from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import packageInfo from '../../../../package';
import {
  FISCAL_YEARS_API,
  FISCAL_YEAR_ROUTE,
} from '../../../common/const';
import FinanceNavigation from '../../../common/FinanceNavigation';
import FiscalYearDetails from '../FiscalYearDetails';

const fiscalYearsPackageInfo = {
  ...packageInfo,
  stripes: {
    ...packageInfo.stripes,
    route: FISCAL_YEAR_ROUTE,
  },
};

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const FILTER_CONFIG = [];

const title = <FormattedMessage id="ui-finance.fiscalyear" />;
const visibleColumns = ['name', 'code', 'description'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.fiscalYear.list.name" />,
  code: <FormattedMessage id="ui-finance.fiscalYear.list.abbreviation" />,
  description: <FormattedMessage id="ui-finance.fiscalYear.list.description" />,
};

const renderNavigation = () => (
  <FinanceNavigation />
);

const FiscalYearsList = ({
  resources,
  mutator,
}) => {
  return (
    <div data-test-fiscal-years-list>
      <SearchAndSort
        packageInfo={fiscalYearsPackageInfo}
        objectName="fiscalYear"
        baseRoute={fiscalYearsPackageInfo.stripes.route}
        title={title}
        initialResultCount={INITIAL_RESULT_COUNT}
        resultCountIncrement={RESULT_COUNT_INCREMENT}
        viewRecordComponent={FiscalYearDetails}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        viewRecordPerms="finance-storage.fiscal-years.item.get"
        newRecordPerms="finance-storage.fiscal-years.item.post"
        parentResources={resources}
        parentMutator={mutator}
        filterConfig={FILTER_CONFIG}
        renderNavigation={renderNavigation}
      />
    </div>
  );
};

FiscalYearsList.manifest = Object.freeze({
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  records: {
    type: 'okapi',
    clear: true,
    records: 'fiscalYears',
    recordsRequired: '%{resultCount}',
    path: FISCAL_YEARS_API,
    perRequest: RESULT_COUNT_INCREMENT,
    throwErrors: false,
    GET: {
      params: {
        query: makeQueryFunction(
          'cql.allRecords=1',
          '',
          {},
          FILTER_CONFIG,
        ),
      },
      staticFallback: { params: {} },
    },
  },
});

FiscalYearsList.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FiscalYearsList);
