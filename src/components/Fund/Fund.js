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
    resources: PropTypes.object.isRequired,
    handleActivate: PropTypes.func
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
    resultCountLedger: { initialValue: INITIAL_RESULT_COUNT },
    ledger: {
      type: 'okapi',
      records: 'ledgers',
      path: 'ledger',
      recordsRequired: '30',
      perRequest: 30
    },
    budgetQuery: {
      initialValue: {
        name: 'query=(fund_id="")',
        count: INITIAL_RESULT_COUNT
      }
    },
    budget: {
      type: 'okapi',
      records: 'budgets',
      path: 'budget',
      recordsRequired: '%{budgetQuery.count}',
      params: { 
        query: (...args) => {
          const data = args[2];
          let cql = `${data.budgetQuery.name} sortby Name`;
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

  componentWillMount() {
    this.props.handleActivate({ id: 'fund' });
  }

  render() {
    const props = this.props;
    const { onSelectRow, disableRecordCreation, onComponentWillUnmount } = this.props;
    const initialPath = (_.get(packageInfo, ['stripes', 'home']));
    const resultsFormatter = {
      'Name': data => _.get(data, ['name'], ''),
      'Code': data => _.toString(_.get(data, ['code'], '')),
      'Description': data => _.get(data, ['description'], ''),
      'Created Date': data => _.toString(_.get(data, ['created_date'], '')),
      'Fund Status': data => _.get(data, ['fund_status'], ''),
      'Currency': data => _.get(data, ['Currency'], ''),
      'Ledger': data => _.get(data, ['ledger_id'], ''),
      'Allocation From': data => _.toString(_.get(data, ['allocation_from'], '')),
      'Allocation To': data => _.toString(_.get(data, ['allocation_to'], '')),
      'Tags': data => _.toString(_.get(data, ['tags'], ''))
    }
    return (
      <div style={{ width: '100%' }} className={css.panepadding}>
        <SearchAndSort
          moduleName={'fund'}
          moduleTitle={'fund'}
          objectName="fund"
          baseRoute={`${this.props.match.path}`}
          filterConfig={filterConfig}
          visibleColumns = {['Name', 'Code', 'Description', 'Created Date', 'Fund Status', 'Currency', 'Ledger', 'Allocation From', 'Allocation To', 'Tags']}
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
          detailProps={this.props.stripes}
          onComponentWillUnmount={this.props.onComponentWillUnmount}
        />
      </div>
    )
  }
}

export default Fund;