import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import _ from "lodash";
import queryString from 'query-string';
// Folio
import Layer from '@folio/stripes-components/lib/Layer';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import removeQueryParam from '@folio/stripes-components/util/removeQueryParam';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import Modal from '@folio/stripes-components/lib/Modal';
// Components and Pages
import FiscalYearPane from './FiscalYearPane';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class FiscalYear extends Component {
  static propTypes = {
    parentMutator: PropTypes.object.isRequired,
    parentResources: PropTypes.object.isRequired,
    updateTitle: PropTypes.func.isRequired,
  }
  
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      selectedRow: {},
      listPreloaderStatus: true,
      showList: false,
      showEditForm: true,
    };
  }

  render() {
    const props = this.props;
    // debugger;
    const records = (props.resources || {}).fiscalYear || [];
    // console.log(records);
    // const loader = () => {
    //   return props.resources.fiscalYear ? props.resources.fiscalYear.isPending : false;
    // }
    console.log(props);
    return (
      <div style={{ border: '1px solid #dcdcdc', marginBottom: '10px' }}>
        <Paneset>
          <Pane defaultWidth="fill" paneTitle="Fiscal Year Listing">
            <MultiColumnList
              // autosize
              // virtualize
              id={`list-fiscal-years-multilist`}
              // contentData={records}
              // selectedRow={this.state.selectedRow}
              // onRowClick={this.onSelectRow}
              // onHeaderClick={this.onHeaderClick}
              visibleColumns={['name']}
              // sortedColumn={sortBy}
              // sortDirection={sortOrder + 'ending'}
              // panePreloader={listPreloaderStatus}
              // onNeedMoreData={this.onNeedMore}
              // loading={loader()}
              loading={false}
            />
          </Pane>
        </Paneset>
      </div>
    )
  }
}

export default FiscalYear;