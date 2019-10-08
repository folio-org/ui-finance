import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
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
import { Callout } from '@folio/stripes/components';
import {
  baseManifest,
  changeSearchIndex,
  getActiveFilters,
  handleFilterChange,
  showToast,
} from '@folio/stripes-acq-components';

import packageInfo from '../../../../package';
import {
  FISCAL_YEARS_API,
  FISCAL_YEAR_ROUTE,
  FISCAL_YEAR_VIEW_ROUTE,
} from '../../../common/const';
import FinanceNavigation from '../../../common/FinanceNavigation';
import FiscalYearDetails from '../FiscalYearDetails';
import FiscalYearForm from '../FiscalYearForm';

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
  code: <FormattedMessage id="ui-finance.fiscalYear.list.code" />,
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
    this.callout = React.createRef();
    this.showToast = showToast.bind(this);
  }

  onCreate = async (fiscalYear) => {
    const { history, mutator } = this.props;

    try {
      const savedFiscalYear = await mutator.records.POST(fiscalYear);

      this.showToast('ui-finance.fiscalYear.actions.save.success');
      history.push(`${FISCAL_YEAR_VIEW_ROUTE}${savedFiscalYear.id}?layer=view`);

      return savedFiscalYear;
    } catch (response) {
      this.showToast('ui-finance.fiscalYear.actions.save.error', 'error');

      return { id: 'Unable to create fiscal year' };
    }
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
          editRecordComponent={FiscalYearForm}
          onCreate={this.onCreate}
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
        <Callout ref={this.callout} />
      </div>
    );
  }
}

FiscalYearsList.manifest = Object.freeze({
  query: {
    initialValue: {
      query: '',
      filters: '',
      sort: 'name',
    },
  },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  records: {
    ...baseManifest,
    clear: true,
    records: 'fiscalYears',
    recordsRequired: '%{resultCount}',
    path: FISCAL_YEARS_API,
    perRequest: RESULT_COUNT_INCREMENT,
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
  history: ReactRouterPropTypes.history.isRequired,
  intl: intlShape.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(injectIntl(FiscalYearsList));
