import React, { Component, Fragment } from 'react';
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
import FormatDate from '../../Utils/FormatDate';
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
            return cql;
          },
        },
        staticFallback: { params: {} },
      },
    },
    queryCustom: {
      initialValue: {
        ledgerIDQuery: 'query=(ledger_id=null)',
        fundQuery: 'query=(fund_id=null)',
        fiscalyearIDQuery: 'query=(id=null)',
        fiscalyearsQuery: 'query=(name="*")',
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
          let cql = `${data.queryCustom.ledgerIDQuery} sortby name`;
          return cql;
        },
      }
    },
    fiscalyear: {
      type: 'okapi',
      records: 'fiscal_years',
      path: 'fiscal_year',
      params: { 
        query: (...args) => {
          const data = args[2];
          let cql = `${data.queryCustom.fiscalyearsQuery} sortby name`;
          return cql;
        },
      }
    },
    fiscalyearID: {
      type: 'okapi',
      records: 'fiscal_years',
      path: 'fiscal_year',
      params: { 
        query: (...args) => {
          const data = args[2];
          let cql = `${data.queryCustom.fiscalyearIDQuery} sortby name`;
          return cql;
        },
      }
    },
    fund: {
      type: 'okapi',
      records: 'funds',
      path: 'fund',
      params: { 
        query: (...args) => {
          const data = args[2];
          let cql = `${data.queryCustom.fundQuery} sortby name`;
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
    this.getFiscalYears = this.getFiscalYears.bind(this);
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

  render() {
    const props = this.props;
    const { onSelectRow, disableRecordCreation, onComponentWillUnmount } = this.props;
    const initialPath = (_.get(packageInfo, ['stripes', 'home']));
    
    const resultsFormatter = {
      'Name': data => _.get(data, ['name'], ''),
      'Code': data => _.get(data, ['code'], ''),
      'Period Start': data => FormatDate(_.get(data, ['period_start'], '')),
      'Period End': data => FormatDate(_.get(data, ['period_end'], ''))
    }

    const getRecords = (this.props.resources || {}).records || []; 
    const getFiscalYearsRecords = this.getFiscalYears();
    const urlQuery = queryString.parse(this.props.location.search || '');
    const packageInfoReWrite = () => {
      const path = '/finance/ledger';
      packageInfo.stripes.route = path;
      packageInfo.stripes.home = path;
      return packageInfo;
    };

    return (
      <div style={{width: '100%'}} className={css.panepadding}>
        {
          getRecords && 
          <Fragment>
            <Tabs
              tabID="ledger"
              parentResources={props.resources}
              parentMutator={props.mutator}
            />
            <SearchAndSort
              packageInfo={packageInfoReWrite()}
              moduleName={packageInfo.name.replace(/.*\//, '')}
              moduleTitle={'ledger'}
              objectName="ledger"
              baseRoute={`${this.props.match.path}`}
              filterConfig={filterConfig}
              visibleColumns={['Name', 'Code', 'Period Start', 'Period End']}
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
              detailProps={{stripes: this.props.stripes, dropdownFiscalyears: getFiscalYearsRecords  }}
              onComponentWillUnmount={this.props.onComponentWillUnmount}
            />
          </Fragment>
        }
      </div>
    )
  }

  getFiscalYears() {
    let newArr = [];
    const fiscalRecords = (this.props.resources.fiscalyear || {}).records || [];
    if (!fiscalRecords || fiscalRecords.length === 0) return null;
    const arrLength = fiscalRecords.length - 1;
    if (fiscalRecords != null) {
      // Loop through records
      let preObj = { label: 'Select a Fiscal Year', value: '' };
      newArr.push(preObj);
      // Loop through records
      Object.keys(fiscalRecords).map((key) => {
        let name = `Code: ${fiscalRecords[key].code}, Name:${fiscalRecords[key].name}`;
        let val = fiscalRecords[key].id;
        let obj = {
          label: _.toString(name),
          value: _.toString(val)
        };
        newArr.push(obj);
        if (Number(key) === arrLength) {
          return newArr;
        }
      });
    }
    return newArr;
  }
}

export default Ledger;