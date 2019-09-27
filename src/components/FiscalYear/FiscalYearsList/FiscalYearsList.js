import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import { get } from 'lodash';

import {
  SearchAndSort,
  makeQueryFunction,
} from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import {
  changeSearchIndex,
  getActiveFilters,
  handleFilterChange,
} from '@folio/stripes-acq-components';

import packageInfo from '../../../../package';
import {
  FISCAL_YEARS_API,
  FISCAL_YEAR_ROUTE,
} from '../../../common/const';
import FinanceNavigation from '../../../common/FinanceNavigation';
import FiscalYearDetails from '../FiscalYearDetails';

import FiscalYearListFilters from './FiscalYearListFilters';
import { filterConfig } from './FiscalYearListFilterConfig';
import {
  searchableIndexes,
  fiscalYearSearchTemplate,
} from './FiscalYearListSearchConfig';

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

class FiscalYearsList extends Component {
  constructor(props) {
    super(props);

    this.getActiveFilters = getActiveFilters.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this);
    this.changeSearchIndex = changeSearchIndex.bind(this);
  }

  getTranslateSearchableIndexes() {
    const { intl: { formatMessage } } = this.props;

    return searchableIndexes.map(index => {
      const label = formatMessage({ id: `ui-finance.fiscalYear.search.${index.label}` });

      return { ...index, label };
    });
  }

  renderFilters = (onChange) => {
    return (
      <FiscalYearListFilters
        activeFilters={this.getActiveFilters()}
        onChange={onChange}
      />
    );
  };

  render() {
    const {
      resources,
      mutator,
    } = this.props;

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
          searchableIndexes={this.getTranslateSearchableIndexes()}
          selectedIndex={get(resources.query, 'qindex')}
          onChangeIndex={this.changeSearchIndex}
          renderFilters={this.renderFilters}
          onFilterChange={this.handleFilterChange}
        />
      </div>
    );
  }
}

FiscalYearsList.manifest = Object.freeze({
  query: {
    initialValue: {
      query: '',
      filters: '',
      sort: '',
    },
  },
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
          fiscalYearSearchTemplate,
          {},
          filterConfig,
        ),
      },
      staticFallback: { params: {} },
    },
  },
});

FiscalYearsList.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

export default stripesConnect(injectIntl(FiscalYearsList));
