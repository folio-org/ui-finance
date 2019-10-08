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
  baseManifest,
  changeSearchIndex,
  getActiveFilters,
  handleFilterChange,
} from '@folio/stripes-acq-components';

import {
  FUNDS_API,
} from '../../common/const';
import FinanceNavigation from '../../common/FinanceNavigation';

import transitionToParams from '../../Utils/transitionToParams';
import removeQueryParam from '../../Utils/removeQueryParam';
import packageInfo from '../../../package';
import {
  ledgersResource,
  fundTypesResource,
} from '../../common/resources';
import FundListFilters from './FundListFilters';
import { filterConfig } from './FundListFilterConfig';
import {
  searchableIndexes,
  fundSearchTemplate,
} from './FundListSearchConfig';
import css from './css/Fund.css';
import FundForm from './FundForm/FundForm';
import Fund from './Fund';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const title = <FormattedMessage id="ui-finance.fund" />;

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

  create = (fundData) => {
    const { mutator } = this.props;

    mutator.records.POST(fundData).then(newFund => {
      mutator.query.update({
        _path: `/finance/fund/view/${newFund.id}`,
        layer: null,
      });
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
    const resultsFormatter = {
      'name': data => get(data, ['name'], ''),
      'code': data => get(data, ['code'], ''),
      'fundStatus': data => get(data, ['fundStatus'], ''),
    };

    const columnMapping = {
      'name': 'Name',
      'code': 'Code',
      'fundStatus': 'Fund Status',
    };

    const packageInfoReWrite = () => {
      const path = '/finance/fund';

      packageInfo.stripes.route = path;
      packageInfo.stripes.home = path;

      return packageInfo;
    };

    return (
      <div
        style={{ width: '100%' }}
        className={css.panepadding}
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
          visibleColumns={['name', 'code', 'fundStatus']}
          resultsFormatter={resultsFormatter}
          viewRecordComponent={Fund}
          onSelectRow={onSelectRow}
          onCreate={this.create}
          editRecordComponent={FundForm}
          newRecordInitialValues={{}}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          finishedResourceName="perms"
          viewRecordPerms="finance-storage.funds.item.get"
          newRecordPerms="finance-storage.funds.item.post,login.item.post"
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
