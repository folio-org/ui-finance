import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  SearchAndSort,
  makeQueryFunction,
} from '@folio/stripes/smart-components';

import {
  FUNDS_API,
} from '../../common/const';
import FinanceNavigation from '../../common/FinanceNavigation';

import transitionToParams from '../../Utils/transitionToParams';
import removeQueryParam from '../../Utils/removeQueryParam';
import packageInfo from '../../../package';
import { Filters, SearchableIndexes } from './fundFilterConfig';
// Components and Pages
import css from './css/Fund.css';
import FundForm from './FundForm/FundForm';
import Fund from './Fund';
import {
  ledgersResource,
  fundTypesResource,
} from '../../common/resources';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const filterConfig = Filters();
const searchableIndexes = SearchableIndexes;

class FundsList extends Component {
  static propTypes = {
    match: PropTypes.object,
    stripes: PropTypes.object,
    onSelectRow: PropTypes.func,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    onComponentWillUnmount: PropTypes.func
  }

  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: ''
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      clear: true,
      records: 'funds',
      recordsRequired: '%{resultCount}',
      path: FUNDS_API,
      perRequest: RESULT_COUNT_INCREMENT,
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(name="%{query.query}*")',
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
  }

  create = (fundData) => {
    const { mutator } = this.props;
    mutator.records.POST(fundData).then(newFund => {
      mutator.query.update({
        _path: `/finance/fund/view/${newFund.id}`,
        layer: null
      });
    });
  }

  renderNavigation = () => (
    <FinanceNavigation />
  );

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
          columnMapping={columnMapping}
          baseRoute={`${match.path}`}
          filterConfig={filterConfig}
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
          searchableIndexes={searchableIndexes}
          selectedIndex={get(this.props.resources.query, 'qindex')}
          searchableIndexesPlaceholder={null}
          onChangeIndex={this.onChangeIndex}
          renderNavigation={this.renderNavigation}
        />
      </div>
    );
  }
}

export default FundsList;
