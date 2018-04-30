import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import _ from "lodash";
import queryString from 'query-string';
// Folio
import Layer from '@folio/stripes-components/lib/Layer';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import { filters2cql, initialFilterState, onChangeFilter as commonChangeFilter } from '@folio/stripes-components/lib/FilterGroups';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import removeQueryParam from '@folio/stripes-components/util/removeQueryParam';
import packageInfo from '../../../package';
import Tabs from '../Tabs';
// Components and Pages
import css from './css/Fund.css';
import FundPane from './FundPane';
import FundView from './FundView';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const filterConfig = [];

class Fund extends Component {
  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired
  }

  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'Name'
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      records: 'funds',
      recordsRequired: '%{resultCount}',
      path: 'fund',
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
              Name: 'name',
              Code: 'code',
              Description: 'description'
            };

            let cql = `(name="${resourceData.query.query}*" or code="${resourceData.query.query}*" or description="${resourceData.query.query}*")`;
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
        ledgerQuery: 'query=(name="*")',
        ledgerIDQuery: 'query=(ledger_id=null)',
        budgetQuery: 'query=(fund_id="null")',
      }
    },
    ledger: {
      type: 'okapi',
      records: 'ledgers',
      path: 'ledger',
      params: {
        query: (...args) => {
          const data = args[2];
          const newData = `${data.queryCustom.ledgerQuery}`;
          if(newData === 'undefined') return undefined;
          let cql = `${newData} sortby name`;
          return cql;
        }
      }
    },
    ledgerID: {
      type: 'okapi',
      records: 'ledgers',
      path: 'ledger',
      recordsRequired: 1,
      params: { 
        query: (...args) => {
          const data = args[2];
          const newData = `${data.queryCustom.ledgerIDQuery}`;
          if(newData === 'undefined') return undefined;
          let cql = `${newData} sortby name`;
          return cql;
        },
      }
    },
    budget: {
      type: 'okapi',
      records: 'budgets',
      path: 'budget',
      params: {
        query: (...args) => {
          const data = args[2];
          const newData = `${data.queryCustom.budgetQuery}`;
          if(newData === 'undefined') return undefined;
          let cql = `${newData} sortby name`;
          return cql;
        }
      }
    }
  });
  
  constructor(props) {
    super(props);
    const query = props.location.search ? queryString.parse(props.location.search) : {};
    this.state = {
      searchTerm: query.query || '',
      sortOrder: query.sort || '',
      filters: initialFilterState(filterConfig, query.filters),
    };
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
    })
  }

  render() {
    const props = this.props;
    const { onSelectRow, disableRecordCreation, onComponentWillUnmount } = this.props;
    const initialPath = (_.get(packageInfo, ['stripes', 'home']));
    const resultsFormatter = {
      'Name': data => _.get(data, ['name'], ''),
      'Code': data => _.toString(_.get(data, ['code'], ''))
    }
    const packageInfoReWrite = () => {
      const path = '/finance/fund';
      packageInfo.stripes.route = path;
      packageInfo.stripes.home = path;
      return packageInfo;
    };

    return (
      <div style={{ width: '100%' }} className={css.panepadding}>
        <Tabs
          tabID="fund"
          parentResources={props.resources}
          parentMutator={props.mutator}
        />
        <SearchAndSort
          packageInfo={packageInfoReWrite()}
          moduleName={'fund'}
          moduleTitle={'fund'}
          objectName="fund"
          baseRoute={`finance/fund/`}
          filterConfig={filterConfig}
          visibleColumns = {['Name', 'Code', ]}
          resultsFormatter={resultsFormatter}
          initialFilters={this.constructor.manifest.query.initialValue.filters}
          viewRecordComponent={FundView}
          onSelectRow={onSelectRow}
          onCreate={this.create}
          editRecordComponent={FundPane}
          newRecordInitialValues={{}}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          finishedResourceName="perms"
          viewRecordPerms="fund.item.get"
          newRecordPerms="fund.item.post,login.item.post,perms.fund.item.post"
          parentResources={props.resources}
          parentMutator={props.mutator}
          detailProps={{stripes: this.props.stripes }}
          onComponentWillUnmount={this.props.onComponentWillUnmount}
        />
      </div>
    )
  }
}

export default Fund;