import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import _ from "lodash";
import queryString from 'query-string';
import { Field, FieldArray } from 'redux-form';
// Folio
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import removeQueryParam from '@folio/stripes-components/util/removeQueryParam';
import MultiColumnList from '@folio/stripes-components/lib/MultiColumnList';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import TextArea from '@folio/stripes-components/lib/TextArea';
import Select from '@folio/stripes-components/lib/Select';
import EditableList from '@folio/stripes-components/lib/structures/EditableList';
import Modal from '@folio/stripes-components/lib/Modal';
// Components and Pages
// import FiscalYearPane from './FiscalYearPane'

const contentData = [
  {
    id: 1,
    name: 'Item 1',
  },
  {
    id: 2,
    name: 'Item 2',
  }
];

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
    this.addFiscalYear = this.addFiscalYear.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleClose = this.handleClose.bind(this)
  }

  handleUpdate(){}
  handleDelete(){}
  handleCreate(){}

  
  addFiscalYear() {
    return (<PaneMenu>
      <Button id={'create-fical-year'} title={'create-fical-year'} onClick={this.gotoAddFiscalYear}>Create Fiscal Year</Button>
    </PaneMenu>);
  }

  gotoAddFiscalYear() {
    console.log('go to create fiscal year');
  }

  render() {
    const props = this.props;
    const records = (props.parentResources || {}).fiscalYear.records || [];
    const editButton = {button:'this is a button'};
    return (
      <Modal dismissible closeOnBackgroundClick open label="example">
        <button onClick={this.handleClose}>Close modal</button>
        <Row>
          <Col xs={8} style={{ margin: "0 auto" }}>
            <div style={{ border: '1px solid #dcdcdc', marginBottom: '10px' }}>
              <Paneset>
                <Pane defaultWidth="100%" paneTitle="Fiscal Year Listing" lastMenu={this.addFiscalYear()}>
                  <MultiColumnList
                    // autosize
                    // virtualize
                    id={`list-fiscal-years-multilist`}
                    contentData={records}
                    // selectedRow={this.state.selectedRow}
                    onRowClick={()=> {return false;}}
                    // onHeaderClick={this.onHeaderClick}
                    visibleColumns={['name', 'code', 'description']}
                    // sortedColumn={sortBy}
                    // sortDirection={sortOrder + 'ending'}
                    // panePreloader={listPreloaderStatus}
                    // onNeedMoreData={this.onNeedMore}
                    // loading={loader()}
                    loading={false}
                  />
                </Pane>
              </Paneset>
              <Pane defaultWidth="100%" paneTitle="Add Fiscal Year">
                <EditableList
                  contentData={records}
                  createButtonLabel="+ Add new"
                  visibleFields={['id', 'name']}
                  onUpdate={this.handleUpdate}
                  onDelete={this.handleDelete}
                  onCreate={this.handleCreate}
                  actionSuppression={{ delete: () => false, edit: () => false }}
                />
              </Pane>
            </div>
          </Col>
        </Row>
      </Modal>
    )
  }

  onAddFiscalYear() {
    this.transitionToParams({ layer: 'addFiscalYear' });
    console.log("add fiscal year");
  }

  onSelectRow() {
    console.log('row selected');
  }

  handleClose() {
    console.log('row selected');
  }
}

export default FiscalYear;