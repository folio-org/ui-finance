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
      { name: 'fiction', cql: false },
      { name: 'anime', cql: true },
    ]
  },
  {
    label: 'Status',
    name: 'status',
    cql: 'status',
    values: [
      { name: 'active', cql: true },
      { name: 'inactive', cql: false },
      { name: 'pending', cql: false },
    ]
  }
];

class TableSortAndFilter extends Component {
  static manifest = Object.freeze({
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
    this.state = {
      filters: ''
    }
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);
    this.renderFilter = this.renderFilter.bind(this);
    this.renderValues = this.renderValues.bind(this);
    this.onChangeFilterCheckbox = this.onChangeFilterCheckbox.bind(this);
  }

  componentWillMount() {
    this.setState({ filters: filterConfig });
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
                  {this.state.filters.map(this.renderFilter)}
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
    
  }

  onSelectRow() {
    return false;
  }

  renderFilter(data, i, all) {
    let parentName = _.get(data, ['name'], '');
    return (
      <div key={`filterwrapper-${i}`}>
        <h5>{`${data.label}`}</h5> 
        {data.values.map((data, i) => this.renderValues(data, i, parentName))}
      </div>
    )
  }

  renderValues(data, i, parentName) {                      
    let getName = _.get(data, ['name'], '');
    return (
      <div key={`filteritem-${i}`}>
        <Checkbox label={getName} name={getName} id={getName} onChange={() => this.onChangeFilterCheckbox(getName, parentName)} checked={`${data.cql}` == 'true'} />
      </div>
    )
  }

  onChangeFilterCheckbox(chckName, parentName) {
    const loopFilters = this.state.filters.map(filters => {
      let arrParentName = filters.name;
      _.mapValues(filters.values, val => {
        if (arrParentName === parentName) {
          if (val.name === chckName) {
            val['cql'] = val.cql !== true;
          }
        }
      });
      return filters;
    });

    this.setState({ filters: loopFilters });
  }
}

export default TableSortAndFilter;