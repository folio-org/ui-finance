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
import css from './css/Budget.css';
import BudgetPane from './BudgetPane';
import BudgetView from './BudgetView';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const filterConfig = [];
class Budget extends Component {
  
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
        sort: 'Name',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      records: 'budgets',
      recordsRequired: '%{resultCount}',
      path: 'budget',
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

            let cql = `(name="${resourceData.query.query}*" or code="${resourceData.query.query}*")`;
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
    fundResultCount: INITIAL_RESULT_COUNT,
    fund: {
      type: 'okapi',
      records: 'funds',
      path: 'fund',
      recordsRequired: '%{fundResultCount}',
      perRequest: RESULT_COUNT_INCREMENT,
    },
    fiscalyearResultCount: INITIAL_RESULT_COUNT,
    fiscalyear: {
      type: 'okapi',
      records: 'fiscal_years',
      path: 'fiscal_year',
      recordsRequired: '%{fiscalyearResultCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: (...args) => {
            const resourceData = args[2];
            const sortMap = {
              Name: 'name'
            };
            let cql = `(name="*")`;
            return cql;
          },
        }
      },
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

  create = (budgetData) => {
    const { mutator } = this.props;
    mutator.records.POST(budgetData).then(newBudget => {
      mutator.query.update({
        _path: `/finance/budget/view/${newBudget.id}`,
        layer: null
      });
    })
  }

  componentWillMount() {
    this.props.handleActivate({ id: 'budget' });
  }

  render() {
    const props = this.props;
    console.log(this.props.resources);
    const { onSelectRow, disableRecordCreation, onComponentWillUnmount } = this.props;
    const initialPath = (_.get(packageInfo, ['stripes', 'home']));
    const resultsFormatter = {
      'Name': data => _.get(data, ['name'], ''),
      'Code': data => _.toString(_.get(data, ['code'], '')),
    }
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
          moduleName={'budget'}
          moduleTitle={'budget'}
          objectName="budget"
          baseRoute={`${this.props.match.path}`}
          filterConfig={filterConfig}
          visibleColumns = {['Name', 'Code'/*, 'Created Date', 'Budget Status', 'Currency', 'Ledger', 'Allocation From', 'Allocation To', 'Tags'*/]}
          resultsFormatter={resultsFormatter}
          initialFilters={this.constructor.manifest.query.initialValue.filters}
          viewRecordComponent={BudgetView}
          onSelectRow={onSelectRow}
          onCreate={this.create}
          editRecordComponent={BudgetPane}
          newRecordInitialValues={{}}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          finishedResourceName="perms"
          viewRecordPerms="budget.item.get"
          newRecordPerms="budget.item.post,login.item.post,perms.budget.item.post"
          parentResources={props.resources}
          parentMutator={props.mutator}
          detailProps={this.props.stripes}
          onComponentWillUnmount={this.props.onComponentWillUnmount}
        />
      </div>
    )
  }
}

export default Budget;