import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SearchAndSort } from '@folio/stripes/smart-components';
import { filters2cql } from '@folio/stripes/components';
import transitionToParams from '../../Utils/transitionToParams';
import removeQueryParam from '../../Utils/removeQueryParam';
import packageInfo from '../../../package';
import Tabs from '../Tabs';
import { Filters, SearchableIndexes } from './fiscalYearFilterConfig';
// Components and Pages
import css from './css/FiscalYear.css';
import FiscalYearPane from './FiscalYearPane';
import FiscalYearView from './FiscalYearView';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const filterConfig = Filters();
const searchableIndexes = SearchableIndexes;

class FiscalYear extends Component {
  static propTypes = {
    match: PropTypes.object,
    stripes: PropTypes.object,
    onSelectRow: PropTypes.func,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    onComponentWillUnmount: PropTypes.func
  }

  static manifest = Object.freeze({
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
      records: 'fiscal_years',
      recordsRequired: '%{resultCount}',
      path: 'fiscal_year',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: (...args) => {
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
    fiscalyearQuery: { initialValue: 'query=(id=null)' },
    fiscalyear: {
      type: 'okapi',
      records: 'fiscal_years',
      path: 'fiscal_year',
      resourceShouldRefresh: true,
      recordsRequired: 1,
      params: {
        query: (...args) => {
          const data = args[2];
          const newData = `${data.fiscalyearQuery}`;
          if (newData === 'undefined') return undefined;
          const cql = `${newData}`;
          return cql;
        }
      }
    },
    ledgerQuery: { initialValue: 'query=(fiscal_years=null)' },
    ledger: {
      type: 'okapi',
      records: 'ledgers',
      resourceShouldRefresh: true,
      path: 'ledger',
      params: {
        query: (...args) => {
          const data = args[2];
          const newData = `${data.ledgerQuery}`;
          if (newData === 'undefined') return undefined;
          const cql = `${newData} sortby name`;
          return cql;
        }
      }
    },
    budgetQuery: { initialValue: 'query=(fund_id=null)' },
    budget: {
      type: 'okapi',
      records: 'budgets',
      resourceShouldRefresh: true,
      path: 'budget',
      params: {
        query: (...args) => {
          const data = args[2];
          const newData = `${data.budgetQuery}`;
          if (newData === 'undefined') return undefined;
          const cql = `${newData} sortby name`;
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

  create = (fiscalyeardata) => {
    const { mutator } = this.props;
    mutator.records.POST(fiscalyeardata).then(newFiscalYear => {
      mutator.query.update({
        _path: `/finance/fiscalyear/view/${newFiscalYear.id}`,
        layer: null
      });
    });
  }

  render() {
    const { onSelectRow, onComponentWillUnmount, resources, mutator, match, stripes } = this.props;
    const resultsFormatter = {
      'Name': data => _.get(data, ['name'], ''),
      'Code': data => _.toString(_.get(data, ['code'], '')),
      'Description': data => _.get(data, ['description'], '')
    };

    const packageInfoReWrite = () => {
      const path = '/finance/fiscalyear';
      packageInfo.stripes.route = path;
      packageInfo.stripes.home = path;
      return packageInfo;
    };

    const columnMapping = {
      'name': 'Name',
      'code': 'Abbreviation',
      'description': 'Description',
    };

    return (
      <div style={{ width: '100%' }} className={css.panepadding}>
        <Tabs
          tabID="fiscalyear"
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
        />
        <SearchAndSort
          packageInfo={packageInfoReWrite()}
          moduleName="fiscal_year"
          moduleTitle="fiscal_year"
          objectName="fiscal_year"
          columnMapping={columnMapping}
          baseRoute={`${match.path}`}
          filterConfig={filterConfig}
          visibleColumns={['name', 'code', 'description']}
          resultsFormatter={resultsFormatter}
          viewRecordComponent={FiscalYearView}
          onSelectRow={onSelectRow}
          onCreate={this.create}
          editRecordComponent={FiscalYearPane}
          newRecordInitialValues={{}}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          finishedResourceName="perms"
          viewRecordPerms="fiscal_year.item.get"
          newRecordPerms="fiscal_year.item.post,login.item.post"
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

export default FiscalYear;
