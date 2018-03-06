import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import _ from "lodash";
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import { Dropdown } from '@folio/stripes-components/lib/Dropdown';
import DropdownMenu from '@folio/stripes-components/lib/DropdownMenu';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Button from '@folio/stripes-components/lib/Button';
import css from './css/TableSortAndFilter.css';

// Unsed components and not required
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import queryString from 'query-string';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import { filters2cql, initialFilterState, onChangeFilter as commonChangeFilter } from '@folio/stripes-components/lib/FilterGroups';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import removeQueryParam from '@folio/stripes-components/util/removeQueryParam';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const filterConfig = [
  {
    label: 'Type',
    name: 'type',
    cql: 'type',
    values: [
      { name: 'fiction', cql: 'active' },
    ]
  }
];

class TableSortAndFilter extends Component {
  static manifest = Object.freeze({
    // Table Query
    tableQuery: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'Name'
      },
    },
    tableRecords: {
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

            let cql = `(name="${resourceData.tableQuery.query}*")`;
            const filterCql = filters2cql(filterConfig, resourceData.tableQuery.filters);
            if (filterCql) {
              if (cql) {
                cql = `(${cql}) and ${filterCql}`;
              } else {
                cql = filterCql;
              }
            }

            const {
              sort
            } = resourceData.tableQuery;
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
        staticFallback: {
          params: {}
        },
      },
    },
  });

  constructor(props) {
    super(props);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.renderFilter = this.renderFilter.bind(this);
  }

  render() {
    const catalogResults = [
      { title: 'Microbiology Today', author: 'James Edward', type: 'fiction' },
      { title: 'Orange Book', author: 'Philip Ramos', type: 'anime' },
    ];

    return (
      <div style={{width: '100%'}} className={css.panepadding}>
        <Paneset>
          <Pane defaultWidth="100%">
            <div className={css.tsf}>
              {/* Dropdown */}
              <Dropdown id="ShowHideColumnsDropdown" open={false} group pullRight>
                <Button data-role="toggle" align="end" bottomMargin0 aria-haspopup="true">&#43; Show/Hide Columns</Button>
                <DropdownMenu data-role="menu" aria-label="available permissions">
                  <ul>
                    <li><a href="#">Example Link 1</a></li>
                    <li><a href="#">Example Link 2</a></li>
                  </ul>
                </DropdownMenu>
              </Dropdown>
              <div className={css.wrapperTsf}>
                { /* filter */ }
                <div className={css.filterTsf}>
                  {filterConfig.map(this.renderFilter)}
                  <Checkbox label="filter" name='filter' id='filter' onChange={this.onChangeFilter} checked={true} />
                </div>
                { /* Table */ }
                <MultiColumnList
                  autosize
                  virtualize
                  id={`list-TableAndSortFilter`}
                  contentData={catalogResults}
                  // selectedRow={this.state.selectedRow}
                  onRowClick={this.onSelectRow}
                  onHeaderClick={this.onHeaderClick}
                  // columnWidths={{ name: '50%', vendor_status: '25%', payment_method: '25%' }}
                  // visibleColumns={['name', 'vendor_status', 'payment_method']}
                  // sortedColumn={sortBy}
                  // sortDirection={sortOrder + 'ending'}
                  // panePreloader={listPreloaderStatus}
                  // onNeedMoreData={this.onNeedMore}
                  // loading={loader()}
                />
              </div>
            </div>
          </Pane>
        </Paneset>
      </div>
    )
  }

  onHeaderClick(e, obj){
    console.log(e);
    console.log(obj);
  }

  onSelectRow() {
    return false;
  }

  onChangeFilter() {

  }
}

export default TableSortAndFilter;
{/* <SearchAndSort
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
/> */}