import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import _ from "lodash";
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { Dropdown } from '@folio/stripes-components/lib/Dropdown';
import DropdownMenu from '@folio/stripes-components/lib/DropdownMenu';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Button from '@folio/stripes-components/lib/Button';
import css from './css/TableSortAndFilter.css';
import TetherComponent from 'react-tether'

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

const visibleColumnsConfig = [
  { 'title': 'author', 'status': true },
  { 'title': 'title', 'status': false },
  { 'title': 'type', 'status': true }
];

class TableSortAndFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: '',
      onToggleColumnDD: false,
      visibleColumns: {},
      // Filter position
      filterTop: 0,
      filterLeft: 300,
      showFilterWrapper: false,
      showFilterName: ''
    }
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);
    this.onToggleColumnDD = this.onToggleColumnDD.bind(this);
    this.columnObjToArr = this.columnObjToArr.bind(this);
    this.resetColumn = this.resetColumn.bind(this);
    this.renderColumnChk = this.renderColumnChk.bind(this);
    this.onChangeColumnChk = this.onChangeColumnChk.bind(this);
    this.renderFilter = this.renderFilter.bind(this);
    this.renderFilterValues = this.renderFilterValues.bind(this);
    this.onChangeFilterChk = this.onChangeFilterChk.bind(this);
    // this.filterLookUp = this.filterLookUp.bind(this);
  }

  componentWillMount() {
    this.setState({ filters: filterConfig, visibleColumns: this.resetColumn() });
  }

  componentDidMount() {
    const newConfig = _.cloneDeep(visibleColumnsConfig);
    this.setState({ visibleColumns: newConfig });
  }

  render() {
    const catalogResults = [
      { title: 'Microbiology Today', author: 'James Edward', type: 'fiction' },
      { title: 'Orange Book', author: 'Philip Ramos', type: 'anime' },
    ];
    const visibleColumns = this.columnObjToArr() ? this.columnObjToArr() : [];
    return (
      <div className={css.tsf}>
        <div className={css.tsfWrapper}>
          {/* Dropdown */}
          <Dropdown id="ShowHideColumnsDropdown" open={this.state.onToggleColumnDD} onToggle={this.onToggleColumnDD} style={{ float: 'right', marginBottom:'10px' }} group pullRight>
            <Button data-role="toggle" align="end" bottomMargin0 aria-haspopup="true">&#43; Show/Hide Columns</Button>
            <DropdownMenu data-role="menu" aria-label="available permissions">
              <ul className="dropdown">
                {this.state.visibleColumns.map(this.renderColumnChk)}
              </ul>
            </DropdownMenu>
          </Dropdown>
          <div className={css.tsfTable}>
            { /* Table */ }
            {this.state.visibleColumns &&
              <MultiColumnList
                autosize
                virtualize
                id={`list-TableAndSortFilter`}
                contentData={catalogResults}
                // selectedRow={this.state.selectedRow}
                onRowClick={this.onSelectRow}
                onHeaderClick={this.onHeaderClick}
                // columnWidths={{ author: '50%', title: '25%', type: '25%' }}
                visibleColumns={visibleColumns}
                // sortedColumn={sortBy}
                // sortDirection={sortOrder + 'ending'}
                // panePreloader={listPreloaderStatus}
                // onNeedMoreData={this.onNeedMore}
                // loading={loader()}
              />
            }
            { /* filter */}
            <div className={css.filterTsf} style={{ top: this.state.filterTop, left: this.state.filterLeft, display: this.state.showFilterWrapper ? 'block' : 'none' }}>
              {this.state.filters.map(this.renderFilter)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  resetColumn() {
    const defaultConfig = _.cloneDeep(visibleColumnsConfig);
    const loopFilter = defaultConfig.map(column => {
      column['status'] = true;
      return column;
    });
    return loopFilter;
  }

  columnObjToArr() {
    const newArr = [];
    this.state.visibleColumns.map((e, i) => {
      if (e.status === true) newArr.push(e.title);
    });
    return newArr;
  }
  
  renderColumnChk(e, i) {
    let getTitle = e.title;
    let getStatus = e.status;
    return (
      <li key={`columnitem-${i}`}>
        <Checkbox label={getTitle} name={getTitle} id={getTitle} onChange={() => this.onChangeColumnChk(getTitle)} checked={getStatus} />
      </li>
    )
  }

  onChangeColumnChk(e) {
    const loopFilter = this.state.visibleColumns.map(column => {
      if (column['title'] === e) {
        const status = column['status'];
        column['status'] = status !== true;
      }
      return column;
    });
    this.setState({ visibleColumns: loopFilter });
  }

  onHeaderClick(e, obj){
    // Assign position to floating filter
    const filterTop = e.nativeEvent.layerY + e.nativeEvent.layerY;
    const filterLeft = e.nativeEvent.layerX;
    // Filter State
    const showFilterWrapper = this.state.showFilterWrapper !== true;
    this.setState({ 
      filterTop,
      filterLeft, 
      showFilterWrapper: showFilterWrapper,
      showFilterName: `${obj.name}`
    });
    // this.filterLookUp();
  }

  // filterLookUp() {
  //   let isName = false;
  //   filterConfig.map(filters => {
  //     console.log(filters);
  //     return
  //   });
  //   return isName;
  // }

  onSelectRow() {
    return false;
  }

  onToggleColumnDD() {
    let val = this.state.onToggleColumnDD !== true;
    this.setState({ onToggleColumnDD: val});
  }

  renderFilter(data, i, all) {
    const parentName = _.get(data, ['name'], '');
    const showFilter = this.state.showFilterName === parentName ? 'block' : 'none';
    // console.log(this.state.showFilterName);
    console.log(this.state.showFilterName);
    return (
      <div key={`filterwrapper-${i}`} style={{ display: showFilter }}>
        <h5>{`${data.label}`}</h5> 
        {data.values.map((data, i) => this.renderFilterValues(data, i, parentName))}
      </div>
    )
  }

  renderFilterValues(data, i, parentName) {                      
    let getName = _.get(data, ['name'], '');
    return <div key={`filteritem-${i}`}>
        <Checkbox label={getName} name={getName} id={getName} onChange={() => this.onChangeFilterChk(getName, parentName)} checked={data.cql} />
      </div>;
  }

  onChangeFilterChk(chckName, parentName) {
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

TableSortAndFilter.propTypes = {
  parentResources: PropTypes.object,
  parentMutator: PropTypes.object
}

TableSortAndFilter.manifest = Object.freeze({
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

export default TableSortAndFilter;