import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SearchAndSort } from '@folio/stripes/smart-components';
import { filters2cql } from '@folio/stripes/components';

import {
  BUDGETS_API,
  LEDGERS_API,
  FUNDS_API,
} from '../../common/const';
import transitionToParams from '../../Utils/transitionToParams';
import removeQueryParam from '../../Utils/removeQueryParam';
import packageInfo from '../../../package';
import Tabs from '../Tabs';
import { Filters, SearchableIndexes } from './fundFilterConfig';
// Components and Pages
import css from './css/Fund.css';
import FundPane from './FundPane';
import FundView from './FundView';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const filterConfig = Filters();
const searchableIndexes = SearchableIndexes;

class Fund extends Component {
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
      records: 'funds',
      resourceShouldRefresh: true,
      recordsRequired: '%{resultCount}',
      path: FUNDS_API,
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: (...args) => {
            /*
              This code is not DRY as it is copied from makeQueryFunction in stripes-components.
              This is necessary, as makeQueryFunction only referneces query paramaters as a data source.
              STRIPES-480 is intended to correct this and allow this query function to be replace with a call
              to makeQueryFunction.
              https://issues.folio.org/browse/STRIPES-480
            */
            const resourceData = args[2];
            const sortMap = {
              'Name': 'name',
              'Code': 'code',
              'Fund Status': 'fundStatus'
            };

            const index = resourceData.query.qindex ? resourceData.query.qindex : 'all';
            const searchableIndex = searchableIndexes.find(idx => idx.value === index);

            let cql = searchableIndex.makeQuery(resourceData.query.query);
            const filterCql = filters2cql(filterConfig, resourceData.query.filters);
            if (filterCql) {
              if (cql) {
                cql = `(${cql}) and ${filterCql}`;
              } else {
                cql = filterCql;
              }
            }

            const { sort } = resourceData.query;
            if (sort) {
              const sortIndexes = sort.split(',').map((sort1) => {
                let reverse = false;
                if (sort1.startsWith('-')) {
                  // eslint-disable-next-line no-param-reassign
                  sort1 = sort1.substr(1);
                  reverse = true;
                }
                let sortIndex = sortMap[sort1] || sort1;
                if (reverse) {
                  sortIndex = `${sortIndex.replace(' ', '/sort.descending ')}/sort.descending`;
                }
                return sortIndex;
              });

              cql += ` sortby ${sortIndexes.join(' ')}`;
            }
            return cql;
          },
        },
        staticFallback: { params: {} },
      },
    },
    queryCustom: {
      initialValue: {
        ledgerQuery: 'query=(name="null")',
        ledgerIDQuery: 'query=(ledgerId=null)',
        budgetQuery: 'query=(fundId="null")',
        fundQuery: 'query=(id="null")',
      }
    },
    fund: {
      type: 'okapi',
      records: 'funds',
      path: FUNDS_API,
      resourceShouldRefresh: true,
      recordsRequired: 1,
      params: {
        query: (...args) => {
          const data = args[2];
          if (`${data.queryCustom.fundQuery}` === 'undefined') return undefined;
          const cql = `${data.queryCustom.fundQuery} sortby name`;
          return cql;
        }
      }
    },
    ledger: {
      type: 'okapi',
      records: 'ledgers',
      path: LEDGERS_API,
      resourceShouldRefresh: true,
      params: {
        query: (...args) => {
          const data = args[2];
          if (`${data.queryCustom.ledgerQuery}` === 'undefined') return undefined;
          const cql = `${data.queryCustom.ledgerQuery} sortby name`;
          return cql;
        }
      }
    },
    ledgerID: {
      type: 'okapi',
      records: 'ledgers',
      path: LEDGERS_API,
      resourceShouldRefresh: true,
      recordsRequired: 1,
      params: {
        query: (...args) => {
          const data = args[2];
          if (`${data.queryCustom.ledgerIDQuery}` === 'undefined') return undefined;
          const cql = `${data.queryCustom.ledgerIDQuery} sortby name`;
          return cql;
        },
      }
    },
    budget: {
      type: 'okapi',
      records: 'budgets',
      path: BUDGETS_API,
      resourceShouldRefresh: true,
      params: {
        query: (...args) => {
          const data = args[2];
          if (`${data.queryCustom.budgetQuery}` === 'undefined') return undefined;
          const cql = `${data.queryCustom.budgetQuery} sortby name`;
          return cql;
        }
      }
    }
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

  render() {
    const { onSelectRow, onComponentWillUnmount, resources, mutator, match, stripes } = this.props;
    const resultsFormatter = {
      'name': data => _.get(data, ['name'], ''),
      'code': data => _.toString(_.get(data, ['code'], '')),
      'fundStatus': data => _.toString(_.get(data, ['fundStatus'], '')),
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
        <Tabs
          tabID="fund"
          parentResources={resources}
          parentMutator={mutator}
        />
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
          viewRecordComponent={FundView}
          onSelectRow={onSelectRow}
          onCreate={this.create}
          editRecordComponent={FundPane}
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
          selectedIndex={_.get(this.props.resources.query, 'qindex')}
          searchableIndexesPlaceholder={null}
          onChangeIndex={this.onChangeIndex}
        />
      </div>
    );
  }
}

export default Fund;
