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
import css from './css/Ledger.css';
import LedgerPane from './LedgerPane';
import LedgerView from './LedgerView';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const filterConfig = [];

class Ledger extends Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'Name'
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    resultCountFiscalYear: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      clear: true,
      records: 'ledgers',
      recordsRequired: '%{resultCount}',
      path: 'ledger',
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
              'Period Start': 'period_start',
              'Period End': 'period_end'
            };

            let cql = `(name="${resourceData.query.query}*")`;
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
            console.log(cql);
            return cql;
          },
        },
        staticFallback: { params: {} },
      },
    },
    fiscalYear: {
      type: 'okapi',
      records: 'fiscal_years',
      recordsRequired: '%{resultCountFiscalYear}',
      path: 'fiscal_year',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: (...args) => {
            const resourceData = args[2];
            const sortMap = {
              Name: 'name',
            };

            let cql = `(name="${resourceData.query.query}*")`;

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
        staticFallback: { params: {}},
      },
    },
    tableQuery: {
      initialValue: {
        query: 'query=(name=*)',
        filter: '',
        sort: 'Name',
        sortBy: 'asc',
        resultCount: INITIAL_RESULT_COUNT,
      },
    },
    resultCountTable: { initialValue: INITIAL_RESULT_COUNT },
    tableRecords: {
      type: 'okapi',
      records: 'vendors',
      path: 'vendor',
      recordsRequired: '%{resultCountTable}',
      perRequest: RESULT_COUNT_INCREMENT,
      params: {
        query: (...args) => {
          const data = args[2];
          let cql = `${data.tableQuery.query} ${data.tableQuery.filter} sortby ${data.tableQuery.sort}`;
          return cql;
        },
      }
    },
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

  create = (ledgerdata) => {
    const { mutator } = this.props;
    mutator.records.POST(ledgerdata).then(newLedger => {
      mutator.query.update({
        _path: `/finance/ledger/view/${newLedger.id}`,
        layer: null
      });
    })
  }

  componentWillMount() {
    // query=(name=*)
    // parentMutator.ledgerQuery.update({ query: `query=(fiscal_years="${initialValues.id}")`, resultCount:30 });
    this.props.handleActivate({ id: 'ledger' });
  }

  render() {
    const props = this.props;
    const { onSelectRow, disableRecordCreation, onComponentWillUnmount } = this.props;
    const initialPath = (_.get(packageInfo, ['stripes', 'home']));
    const resultsFormatter = {
      'Name': data => _.get(data, ['name'], ''),
      'Code': data => _.get(data, ['code'], ''),
      'Description': data => _.get(data, ['description'], ''),
      'Period Start': data => _.get(data, ['period_start'], ''),
      'Period End': data => _.get(data, ['period_end'], ''),
      'Fiscal Year': data => _.toString(_.get(data, ['fiscal_years'], ''))
    }
    const getRecords = (this.props.resources || {}).records || [];
    const urlQuery = queryString.parse(this.props.location.search || '');
    return (
      <div style={{width: '100%'}} className={css.panepadding}>
        {
          getRecords  &&
          <SearchAndSort
            moduleName={packageInfo.name.replace(/.*\//, '')}
            moduleTitle={'ledger'}
            objectName="ledger"
            baseRoute={`${this.props.match.path}`}
            filterConfig={filterConfig}
            visibleColumns={['Name', 'Code', 'Description', 'Period Start', 'Period End', 'Fiscal Year']}
            resultsFormatter={resultsFormatter}
            initialFilters={this.constructor.manifest.query.initialValue.filters}
            viewRecordComponent={LedgerView}
            onSelectRow={onSelectRow}
            onCreate={this.create}
            editRecordComponent={LedgerPane}
            newRecordInitialValues={{}}
            initialResultCount={INITIAL_RESULT_COUNT}
            resultCountIncrement={RESULT_COUNT_INCREMENT}
            finishedResourceName="perms"
            viewRecordPerms="ledger.item.get"
            newRecordPerms="ledger.item.post,login.item.post,perms.ledger.item.post"
            parentResources={props.resources}
            parentMutator={props.mutator}
            detailProps={this.props.stripes}
            onComponentWillUnmount={this.props.onComponentWillUnmount}
          />
        }
      </div>
    )
  }
}

export default Ledger;