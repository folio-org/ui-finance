import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import _ from "lodash";
import queryString from 'query-string';
import { Field, FieldArray } from 'redux-form';
// Folio
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Layer from '@folio/stripes-components/lib/Layer';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import removeQueryParam from '@folio/stripes-components/util/removeQueryParam';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import Modal from '@folio/stripes-components/lib/Modal';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import TextArea from '@folio/stripes-components/lib/TextArea';
import Select from '@folio/stripes-components/lib/Select';
// Components and Pages
import FiscalYearPane from './FiscalYearPane';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class FiscalYear extends Component {
  static propTypes = {
    parentMutator: PropTypes.object.isRequired,
    parentResources: PropTypes.object.isRequired,
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

    this.transitionToParams = transitionToParams.bind(this);
    this.onAddFiscalYear = this.onAddFiscalYear.bind(this);
  }

  render() {
    const props = this.props;
    // debugger;
    const records = (props.resources || {}).fiscalYear || [];
    // console.log(records);
    // const loader = () => {
    //   return props.resources.fiscalYear ? props.resources.fiscalYear.isPending : false;
    // }

    return (
      <Row>
        <Col xs={8} style={{ margin: "0 auto" }}>
          <div style={{display: 'block', clear: 'both', overflow: 'hidden'}}>
            <Button buttonStyle='primary' id="Add-Fiscal-Year" onClick={this.onAddFiscalYear} title="Add Fiscal Year" style={{ float: 'right' }}>+ Add Fiscal Year</Button>
          </div>
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
        </Col>
        <FiscalYearPane />
      </Row>
    )
  }

  onAddFiscalYear() {
    this.transitionToParams({ layer: 'addFiscalYear' });
    console.log("add fiscal year");
  }
}

export default FiscalYear;