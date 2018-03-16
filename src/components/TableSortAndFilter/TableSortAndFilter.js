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
import Icon from '@folio/stripes-components/lib/Icon';

// Unsed components and not required
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import queryString from 'query-string';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import { filters2cql, initialFilterState, onChangeFilter as commonChangeFilter } from '@folio/stripes-components/lib/FilterGroups';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import removeQueryParam from '@folio/stripes-components/util/removeQueryParam';

const RESULT_COUNT_INCREMENT = 30;

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
    this.createFilterQuery = this.createFilterQuery.bind(this);
    this.isData = this.isData.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onNeedMore = this.onNeedMore.bind(this);
  }

  componentWillMount() {
    this.setState({ filters: this.props.filterConfig, visibleColumns: this.resetColumn() });
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    const newConfig = _.cloneDeep(this.props.visibleColumnsConfig);
    this.setState({ visibleColumns: newConfig });
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);    
  }

  render() {
    const { parentResources, resourceName } = this.props;
    const visibleColumns = this.columnObjToArr() ? this.columnObjToArr() : [];
    const loader = () => parentResources[resourceName] ? parentResources[resourceName].isPending : false;

    if(!this.isData) {
      return (
        <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
      )
    }
      return (
      <div className={css.tsf}>
        <div className={css.tsfWrapper}>
          {/* Dropdown */}
          <Dropdown id="ShowHideColumnsDropdown" open={this.state.onToggleColumnDD} onToggle={this.onToggleColumnDD} style={{ float: 'right', marginBottom:'10px' }} group pullRight>
            <Button data-role="toggle" align="end" bottomMargin0 aria-haspopup="true">&#43; Show/Hide Columns</Button>
            <DropdownMenu data-role="menu" aria-label="available permissions">
              <ul className={css.showhideDropdown}>
                {this.state.visibleColumns.map(this.renderColumnChk)}
              </ul>
            </DropdownMenu>
          </Dropdown>
          <div className={css.tsfTable}>
            { /* Table */ }
            <MultiColumnList
              autosize
              virtualize
              interactive={false}
              id={`list-TableAndSortFilter`}
              contentData={this.isData()}
              formatter={this.props.formatter}
              // selectedRow={this.state.selectedRow}
              onRowClick={this.onSelectRow}
              onHeaderClick={this.onHeaderClick}
              // columnWidths={{ author: '50%', title: '25%', type: '25%' }}
              visibleColumns={visibleColumns}
              // sortedColumn={sortBy}
              // sortDirection={sortOrder + 'ending'}
              // panePreloader={listPreloaderStatus}
              onNeedMoreData={this.onNeedMore}
              loading={loader()}
            />
            { /* filter */}
            <div className={css.filterTsf} style={{ top: this.state.filterTop, left: this.state.filterLeft, display: this.state.showFilterWrapper ? 'block' : 'none' }} ref={this.setWrapperRef}>
              {this.state.filters.map(this.renderFilter)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  isData = () => {
    const { parentResources, resourceName } = this.props;
    const data = (parentResources[resourceName] || {}).records || [];
    if (!data || data.length === 0) return null;
    return data;
  }

  resetColumn() {
    const defaultConfig = _.cloneDeep(this.props.visibleColumnsConfig);
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
    const wrapperStatus = this.state.showFilterWrapper;
    const FilterName = this.state.showFilterName;
    let filterLookup = () => {
      let filters = this.state.filters;
      for (let i = 0; i < filters.length; i++) {
        if (filters[i].name === obj.name) {
          return true;
          break;
        }
      }
      return false;
    }
    // Check Filter and show/hide filter wrapper
    const showFilterWrapper = () => {
      if ((!FilterName || FilterName !== obj.name) && filterLookup()) {
        return true;
      } else if ((!FilterName || !this.state.showFilterWrapper) && filterLookup()) {
        return true;
      } else {
        return false;
      }
    }

    this.setState({ 
      filterTop,
      filterLeft, 
      showFilterWrapper: showFilterWrapper(),
      showFilterName: `${obj.name}`
    });
  }

  onSelectRow() {
    return false;
  }

  onToggleColumnDD() {
    let val = this.state.onToggleColumnDD !== true;
    this.setState({ onToggleColumnDD: val});
  }

  renderFilter(data, i, all) {
    const parentName = _.get(data, ['name'], '');
    let showFilter = 'none';
    if ((this.state.showFilterName === parentName) && this.state.showFilterWrapper) {
      showFilter = 'block';
    }
    
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
    this.createFilterQuery(loopFilters);
  }
  
  createFilterQuery(arg) {
    const { parentResources } = this.props;
    let parentItem = "";
    let parentArr = [];
    const filterQuery = this.state.filters.map(filters => {
      let groupItem;
      let groupArr = [];
      let parentArrName = filters.name;
      _.mapValues(filters.values, val => {
        console.log(val.cql);
        if (val.cql === true) {
          groupArr.push(val.name);
        }
      });
      // Join items
      if (groupArr.length >= 1) {
        groupItem = groupArr.join(" or ");
        parentArr.push(`${parentArrName}=(${groupItem})`);
      }
      // Join Parent Filters
      if (parentArr.length >= 1) {
        parentItem = "and " + parentArr.join(" and ");
      }
      // Updated filter
      this.props.onUpdateFilter(parentItem);
    });
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ showFilterWrapper: false });
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  onNeedMore() {
    if (!_.isUndefined(this.props)) {
      if (!_.isNull(this.props.parentResources)) {
        // console.log(this.props);
        const { parentResources, parentMutator } = this.props;
        let num = parentResources.resultCountTable + RESULT_COUNT_INCREMENT;
        parentMutator.resultCountTable.replace(num);
      }
    }
  }
}

TableSortAndFilter.propTypes = {
  parentResources: PropTypes.object,
  parentMutator: PropTypes.object,
  filterConfig: PropTypes.array,
  visibleColumnsConfig: PropTypes.array,
  formatter: PropTypes.object,
  onUpdateFilter: PropTypes.func
}

export default TableSortAndFilter;