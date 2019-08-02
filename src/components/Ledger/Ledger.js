import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// Folio
import { FormattedMessage } from 'react-intl';
import { SearchAndSort } from '@folio/stripes/smart-components';
import { filters2cql } from '@folio/stripes/components';

import {
  FISCAL_YEARS_API,
  LEDGERS_API,
  FUNDS_API,
} from '../../common/const';
import FinanceNavigation from '../../common/FinanceNavigation';

import transitionToParams from '../../Utils/transitionToParams';
import removeQueryParam from '../../Utils/removeQueryParam';
import packageInfo from '../../../package';
import { Filters, SearchableIndexes } from './LedgerFilterConfig';
// Components and Pages
import css from './css/Ledger.css';
import LedgerPane from './LedgerPane';
import LedgerView from './LedgerView';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const filterConfig = Filters();
const searchableIndexes = SearchableIndexes;

class Ledger extends Component {
  static propTypes = {
    match: PropTypes.object,
    stripes: PropTypes.object,
    onSelectRow: PropTypes.func,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    onComponentWillUnmount: PropTypes.func
  };

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
      records: 'ledgers',
      recordsRequired: '%{resultCount}',
      path: LEDGERS_API,
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: (...args) => {
            const resourceData = args[2];
            const sortMap = {
              'Name': 'name',
              'Code': 'code'
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
        ledgerIDQuery: 'query=(id="null")',
        fundQuery: 'query=(ledgerId="null")',
        fiscalyearIDQuery: 'query=(id="null")',
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
    fiscalyear: {
      type: 'okapi',
      records: 'fiscalYears',
      path: FISCAL_YEARS_API,
      resourceShouldRefresh: true,
      params: {
        query: () => {
          const cql = 'query=(id="*") sortby id';
          return cql;
        },
      }
    },
    fiscalyearID: {
      type: 'okapi',
      records: 'fiscalYears',
      path: FISCAL_YEARS_API,
      resourceShouldRefresh: true,
      params: {
        query: (...args) => {
          const data = args[2];
          if (`${data.queryCustom.fiscalyearIDQuery}` === 'undefined') return undefined;
          const cql = `${data.queryCustom.fiscalyearIDQuery} sortby name`;
          return cql;
        }
      }
    },
    fund: {
      type: 'okapi',
      records: 'funds',
      resourceShouldRefresh: true,
      path: FUNDS_API,
      params: {
        query: (...args) => {
          const data = args[2];
          if (`${data.queryCustom.fundQuery}` === 'undefined') return undefined;
          const cql = `${data.queryCustom.fundQuery} sortby name`;
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
    this.getFiscalYears = this.getFiscalYears.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    const fy = (nextProps.resources.fiscalyear || {}).records || [];
    if (fy && fy.length) {
      const fyFilterConfig = filterConfig.find(group => group.name === 'fiscalYears');
      const fyLength = fyFilterConfig.values.length;
      fyFilterConfig.values = fy.map(rec => ({ name: rec.name, cql: rec.id }));
      if (fyLength === 0) {
        nextProps.mutator.initializedFilterConfig.replace(true);
      }
    }

    return null;
  }

  create = (ledgerdata) => {
    const { mutator } = this.props;
    mutator.records.POST(ledgerdata).then(newLedger => {
      mutator.query.update({
        _path: `/finance/ledger/view/${newLedger.id}`,
        layer: null
      });
    });
  }

  onChangeIndex = (e) => {
    const qindex = e.target.value;
    this.props.mutator.query.update({ qindex });
  }

  getFiscalYears() {
    const newArr = [];
    const fiscalRecords = (this.props.resources.fiscalyear || {}).records || [];
    if (!fiscalRecords || fiscalRecords.length === 0) return null;
    const arrLength = fiscalRecords.length - 1;
    if (fiscalRecords != null) {
      // Loop through records
      const preObj = { label: 'Select a Fiscal Year', value: '' };
      newArr.push(preObj);
      // Loop through records
      Object.keys(fiscalRecords).map((key) => {
        const name = `${fiscalRecords[key].name}`;
        const val = fiscalRecords[key].id;
        const obj = {
          label: _.toString(name),
          value: _.toString(val)
        };
        newArr.push(obj);
        if (Number(key) === arrLength) {
          return newArr;
        }
        return newArr;
      });
    }
    return newArr;
  }

  renderNavigation = () => (
    <FinanceNavigation />
  );

  render() {
    const { onSelectRow, onComponentWillUnmount, resources, mutator, match, stripes } = this.props;
    const resultsFormatter = {
      'Name': data => _.get(data, ['name'], ''),
      'Code': data => _.get(data, ['code'], '')
    };
    const getRecords = (resources || {}).records || [];
    const getFiscalYearsRecords = this.getFiscalYears();
    const packageInfoReWrite = () => {
      const path = '/finance/ledger';
      packageInfo.stripes.route = path;
      packageInfo.stripes.home = path;
      return packageInfo;
    };
    const columnMapping = {
      'name': <FormattedMessage id="ui-finance.ledger.name" />,
      'code': <FormattedMessage id="ui-finance.ledger.code" />,
    };

    return (
      <div style={{ width: '100%' }} className={css.panepadding}>
        {
          getRecords &&
          <Fragment>
            <SearchAndSort
              packageInfo={packageInfoReWrite()}
              moduleName={packageInfo.name.replace(/.*\//, '')}
              moduleTitle="ledger"
              objectName="ledger"
              columnMapping={columnMapping}
              baseRoute={`${match.path}`}
              filterConfig={filterConfig}
              visibleColumns={['name', 'code']}
              resultsFormatter={resultsFormatter}
              viewRecordComponent={LedgerView}
              onSelectRow={onSelectRow}
              onCreate={this.create}
              editRecordComponent={LedgerPane}
              newRecordInitialValues={{}}
              initialResultCount={INITIAL_RESULT_COUNT}
              resultCountIncrement={RESULT_COUNT_INCREMENT}
              finishedResourceName="perms"
              viewRecordPerms="finance-storage.ledgers.item.get"
              newRecordPerms="finance-storage.ledgers.item.post,login.item.post"
              parentResources={resources}
              parentMutator={mutator}
              detailProps={{ stripes, dropdownFiscalyears: getFiscalYearsRecords }}
              onComponentWillUnmount={onComponentWillUnmount}
              searchableIndexes={searchableIndexes}
              selectedIndex={_.get(this.props.resources.query, 'qindex')}
              searchableIndexesPlaceholder={null}
              onChangeIndex={this.onChangeIndex}
              renderNavigation={this.renderNavigation}
            />
          </Fragment>
        }
      </div>
    );
  }
}

export default Ledger;
