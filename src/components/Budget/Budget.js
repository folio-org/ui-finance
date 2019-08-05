import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// Folio
import { SearchAndSort } from '@folio/stripes/smart-components';
import { filters2cql } from '@folio/stripes/components';

import {
  BUDGETS_API,
  FISCAL_YEARS_API,
  FUNDS_API,
} from '../../common/const';
import transitionToParams from '../../Utils/transitionToParams';
import removeQueryParam from '../../Utils/removeQueryParam';
import packageInfo from '../../../package';
import { Filters, SearchableIndexes } from './budgetFilterConfig';
// Components and Pages
import css from './css/Budget.css';
import BudgetPane from './BudgetPane';
import BudgetView from './BudgetView';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const filterConfig = Filters();
const searchableIndexes = SearchableIndexes;

class Budget extends Component {
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
        sort: '',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      records: 'budgets',
      recordsRequired: '%{resultCount}',
      path: BUDGETS_API,
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
        budgetIDQuery: 'query=(id=null)',
        fiscalyearQuery: 'query=(name=*)',
        fundQueryID: 'query=(id=null)',
        fiscalyearQueryID: 'query=(id=null)'
      }
    },
    budgetID: {
      type: 'okapi',
      records: 'budgets',
      path: BUDGETS_API,
      recordsRequired: 1,
      params: {
        query: (...args) => {
          const data = args[2];
          const newData = `${data.queryCustom.budgetIDQuery}`;
          if (newData === 'undefined') return undefined;
          const cql = `${newData} sortby name`;
          return cql;
        },
      }
    },
    fund: {
      type: 'okapi',
      records: 'funds',
      path: FUNDS_API,
      params: {
        query: '(name=*)',
      },
      perRequest: 200,
      resourceShouldRefresh: true
    },
    fiscalyear: {
      type: 'okapi',
      records: 'fiscalYears',
      path: FISCAL_YEARS_API,
      params: {
        query: '(name=*)',
      },
      perRequest: 200,
      resourceShouldRefresh: true
    },
    fundID: {
      type: 'okapi',
      records: 'funds',
      path: FUNDS_API,
      recordsRequired: 1,
      params: {
        query: (...args) => {
          const data = args[2];
          const newData = `${data.queryCustom.fundQueryID}`;
          if (newData === 'undefined') return undefined;
          const cql = `${newData} sortby name`;
          return cql;
        }
      }
    },
    fiscalyearID: {
      type: 'okapi',
      records: 'fiscalYears',
      path: FISCAL_YEARS_API,
      recordsRequired: 1,
      params: {
        query: (...args) => {
          const data = args[2];
          const newData = `${data.queryCustom.fiscalyearQueryID}`;
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

  create = (budgetData) => {
    const { mutator } = this.props;
    mutator.records.POST(budgetData).then(newBudget => {
      mutator.query.update({
        _path: `/finance/budget/view/${newBudget.id}`,
        layer: null
      });
    });
  }

  render() {
    const { onSelectRow, onComponentWillUnmount, resources, mutator, match, stripes } = this.props;
    const resultsFormatter = {
      'Name': data => _.get(data, ['name'], ''),
      'Code': data => _.toString(_.get(data, ['code'], '')),
    };
    const packageInfoReWrite = () => {
      const path = '/finance/budget';
      packageInfo.stripes.route = path;
      packageInfo.stripes.home = path;
      return packageInfo;
    };

    return (
      <div style={{ width: '100%' }} className={css.panepadding}>
        <SearchAndSort
          packageInfo={packageInfoReWrite()}
          moduleName="budget"
          moduleTitle="budget"
          objectName="budget"
          baseRoute={`${match.path}`}
          filterConfig={filterConfig}
          visibleColumns={['Name', 'Code']}
          resultsFormatter={resultsFormatter}
          viewRecordComponent={BudgetView}
          onSelectRow={onSelectRow}
          onCreate={this.create}
          editRecordComponent={BudgetPane}
          newRecordInitialValues={{}}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          finishedResourceName="perms"
          viewRecordPerms="finance-storage.budgets.item.get"
          newRecordPerms="finance-storage.budgets.item.post,login.item.post"
          parentResources={resources}
          parentMutator={mutator}
          detailProps={stripes}
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

export default Budget;
