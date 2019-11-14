import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import {
  get,
  keyBy,
} from 'lodash';

import {
  SearchAndSort,
  makeQueryFunction,
} from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  changeSearchIndex,
  FUNDS_API,
  fundsManifest,
  getActiveFilters,
  handleFilterChange,
} from '@folio/stripes-acq-components';

import FinanceNavigation from '../../common/FinanceNavigation';
import transitionToParams from '../../Utils/transitionToParams';
import removeQueryParam from '../../Utils/removeQueryParam';
import packageInfo from '../../../package';
import {
  ledgersResource,
  fundTypesResource,
} from '../../common/resources';
import { FUNDS_ROUTE } from '../../common/const';
import FundListFilters from './FundListFilters';
import { filterConfig } from './FundListFilterConfig';
import {
  searchableIndexes,
  fundSearchTemplate,
} from './FundListSearchConfig';
import FundForm from './FundForm';
import Fund from './Fund';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const title = <FormattedMessage id="ui-finance.fund" />;
const columnMapping = {
  name: <FormattedMessage id="ui-finance.fund.list.name" />,
  code: <FormattedMessage id="ui-finance.fund.list.code" />,
  fundStatus: <FormattedMessage id="ui-finance.fund.list.status" />,
  ledger: <FormattedMessage id="ui-finance.fund.list.ledger" />,
};
const visibleColumns = ['name', 'code', 'fundStatus', 'ledger'];

class FundsList extends Component {
  static propTypes = {
    match: PropTypes.object,
    intl: intlShape.isRequired,
    stripes: PropTypes.object,
    onSelectRow: PropTypes.func,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    onComponentWillUnmount: PropTypes.func,
  }

  static manifest = Object.freeze({
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
      records: 'funds',
      recordsRequired: '%{resultCount}',
      path: FUNDS_API,
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            fundSearchTemplate,
            {},
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    ledgers: ledgersResource,
    fundTypes: fundTypesResource,
    fundsByName: {
      ...fundsManifest,
      accumulate: true,
      fetch: false,
    },
  });

  constructor(props) {
    super(props);
    this.state = {};
    this.transitionToParams = transitionToParams.bind(this);
    this.removeQueryParam = removeQueryParam.bind(this);
    this.getActiveFilters = getActiveFilters.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this);
    this.changeSearchIndex = changeSearchIndex.bind(this);
  }

  create = (newFund) => {
    const { mutator } = this.props;

    mutator.query.update({
      _path: `/finance/fund/view/${newFund.fund.id}`,
      layer: null,
    });
  }

  renderNavigation = () => (
    <FinanceNavigation />
  );

  getTranslateSearchableIndexes() {
    const { intl: { formatMessage } } = this.props;

    return searchableIndexes.map(index => {
      const label = formatMessage({ id: `ui-finance.fund.search.${index.label}` });

      return { ...index, label };
    });
  }

  renderFilters = (onChange) => {
    return (
      <FundListFilters
        activeFilters={this.getActiveFilters()}
        onChange={onChange}
      />
    );
  };

  render() {
    const { onSelectRow, onComponentWillUnmount, resources, mutator, match, stripes } = this.props;
    const ledgers = keyBy(get(resources, ['ledgers', 'records'], []), 'id');
    const resultsFormatter = {
      ledger: ({ ledgerId }) => get(ledgers[ledgerId], 'name'),
    };

    const packageInfoReWrite = () => {
      const path = FUNDS_ROUTE;

      packageInfo.stripes.route = path;
      packageInfo.stripes.home = path;

      return packageInfo;
    };

    return (
      <div
        style={{ width: '100%' }}
        data-test-funds-list
      >
        <SearchAndSort
          packageInfo={packageInfoReWrite()}
          moduleName="fund"
          moduleTitle="fund"
          objectName="fund"
          title={title}
          columnMapping={columnMapping}
          baseRoute={`${match.path}`}
          visibleColumns={visibleColumns}
          resultsFormatter={resultsFormatter}
          viewRecordComponent={Fund}
          onSelectRow={onSelectRow}
          onCreate={this.create}
          editRecordComponent={FundForm}
          newRecordInitialValues={{}}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          finishedResourceName="perms"
          viewRecordPerms="finance.funds.item.get"
          newRecordPerms="finance.funds.item.post,login.item.post"
          parentResources={resources}
          parentMutator={mutator}
          detailProps={{ stripes }}
          onComponentWillUnmount={onComponentWillUnmount}
          searchableIndexesPlaceholder={null}
          renderNavigation={this.renderNavigation}
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

export default stripesConnect(injectIntl(FundsList));
