import React, { Component, Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import _ from 'lodash';
import PropTypes from 'prop-types';
import queryString from 'query-string';
// Components and Pages
import Layer from '@folio/stripes-components/lib/Layer';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Icon from '@folio/stripes-components/lib/Icon';
import IconButton from '@folio/stripes-components/lib/IconButton';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import IfInterface from '@folio/stripes-components/lib/IfInterface';
import Button from '@folio/stripes-components/lib/Button';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import LedgerPane from './LedgerPane';
import ConnectionListing from '../ConnectionListing';
import FormatDate from '../../Utils/FormatDate';

class LedgerView extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    onCloseEdit: PropTypes.func,
    parentResources: PropTypes.shape({}),
    parentMutator: PropTypes.shape({}),
    dropdownFiscalyears: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }))
  }

  constructor(props) {
    super(props);
    this.state = {
      viewID: '',
      fiscalyearID: null,
      fundData: [],
    };
    this.getFiscalYears = this.getFiscalYears.bind(this);
    this.connectedLedgerPane = this.props.stripes.connect(LedgerPane);
    this.onUpdateFilter = this.onUpdateFilter.bind(this);
    this.getFund = this.getFund.bind(this);
    this.getData = this.getData.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { parentMutator, parentResources, match: { params: { id } } } = nextProps;
  
    let queryData = () => {
      parentMutator.queryCustom.update({ 
        fundQuery: `query=(ledger_id="${id}")`,
        ledgerIDQuery: `query=(id="${id}")`, 
        fiscalyearsQuery: `query=(name="*")`
      });
    }

    if(parentResources && (parentResources.fund && parentResources.ledgerID)) {
      if(!_.isEqual(prevState.viewID, id)) {
        queryData();
        return { viewID:id };
      }
      
      if(!_.isEqual(prevState.fundData, parentResources.fund.records)) {
        queryData();
        let fund = (parentResources.fund || {}).records || [];
        return { fundData: fund };
      }
      
      const ledger = parentResources.ledgerID.records;
      if (ledger[0]) {
        const fyID = ledger[0].fiscal_years[0];
        if(!_.isEqual(prevState.fiscalyearID, fyID)) {
          parentMutator.queryCustom.update({ fiscalyearIDQuery: `query=(id="${fyID}")`});
          return { fiscalyearID: fyID };
        }
      }
    }
    return false;
  }

  componentWillUnmount(){
    const { parentMutator, parentResources, match: { params: { id } } } = this.props;
    parentMutator.queryCustom.update({ 
      ledgerIDQuery: 'query=(ledger_id="")',
      fundQuery: `query=(ledger_id="")`,
      fiscalyearIDQuery: `query=(fiscal_years="")`,
      fiscalyearsQuery: `query=(name="")`
    });
  }

  render() {  
    const initialValues = this.getData();
    const query = location.search ? queryString.parse(location.search) : {};
    const detailMenu = (<PaneMenu>
      <IfPermission perm="ledger.item.put">
        <IconButton
          icon="edit"
          id="clickable-editledger"
          style={{ visibility: !initialValues ? 'hidden' : 'visible' }}
          onClick={this.props.onEdit}
          href={this.props.editLink}
          title="Edit Ledger"
        />
      </IfPermission>
    </PaneMenu>);
    // Table Sort Filter Config
    const filterConfig = [
      {
        label: 'Vendor Status',
        name: 'vendor_status',
        cql: 'vendor_status',
        values: [
          { name: 'active', cql: false },
          { name: 'inactive', cql: false },
          { name: 'pending', cql: false },
        ]
      }
    ];
    const visibleColumnsConfig = [
      { 'title': 'name', 'status': true },
      { 'title': 'vendor_status', 'status': true }
    ];
    // Table
    const formatter = {
      name: data => _.get(data, ['name'], ''),
      vendor_status: data => _.get(data, ['vendor_status'], '')
    };
    const startDate = FormatDate(_.get(initialValues, ['period_start'], ''));
    const endDate = FormatDate(_.get(initialValues, ['period_end'], ''));
    // Connections
    const isFundData = this.getFund() !== null ? true : false;
        
    if (!initialValues) {
      return (
        <Pane id="pane-ledgerdetails" defaultWidth={this.props.paneWidth} paneTitle="Details" lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
          <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
        </Pane> 
      );
    }
    
    return (
      <Pane id="pane-ledgerdetails" defaultWidth={this.props.paneWidth} paneTitle={_.get(initialValues, ['name'], '')} lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
        <Row>
          <Col xs={3}>
            <KeyValue label="name" value={_.get(initialValues, ['name'], '')} />
          </Col>
          <Col xs={3}>
            <KeyValue label="code" value={_.get(initialValues, ['code'], '')} />
          </Col>
          <Col xs={3}>
            <KeyValue label="period start" value={startDate} /> 
          </Col>
          <Col xs={3}>
            <KeyValue label="period end" value={endDate} />
          </Col>
          <Col xs={12}>
            <KeyValue label="Fiscal Year" value={this.getFiscalYears()} />
          </Col>
          {
            isFundData &&
            <Col xs={12}>
              <hr />
              <ConnectionListing
                title={'Fund Connection'}
                isEmptyMessage={'"No items found"'}
                items={this.getFund()}
                isView={true}
                path={'/finance/fund/view/'}
              />
            </Col>
          }
        </Row>
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label="Edit Ledger Dialog">
          <this.connectedLedgerPane
            stripes={this.props.stripes}
            initialValues={initialValues}
            onSubmit={(record) => { this.update(record); }}
            onCancel={this.props.onCloseEdit}
            parentResources={this.props.parentResources}
            parentMutator={this.props.parentMutator}
            dropdownFiscalyears={this.props.dropdownFiscalyears}
            fundData={this.getFund()}
            isFundData={isFundData}
          />
        </Layer>
      </Pane>
    )
  }

  getData() {
    const { parentResources, match: { params: { id } } } = this.props;
    const ledgers = (parentResources.records || {}).records || [];
    if (!ledgers || ledgers.length === 0 || !id) return null;
    return ledgers.find(u => u.id === id);  
  }

  getFund() {
    const { parentResources, match: { params: { id } } } = this.props;
    const fund = (parentResources.fund || {}).records || [];
    if (!fund || fund.length === 0 || !id) return null;
    return fund;  
  }

  getFiscalYears = () => {
    const { parentResources } = this.props;
    const data = (parentResources.fiscalyearID || {}).records || [];
    if (!data || data.length === 0) return null;
    const newData = data[0];
    return (
      <p>{_.get(newData, ['name'], '')}, {_.get(newData, ['description'], '')}</p>
    )
  }

  update(ledgerdata) {
    const fiscalyear = ledgerdata.fiscal_years;
    ledgerdata['fiscal_years'] = [`${fiscalyear}`];
    this.props.parentMutator.records.PUT(ledgerdata).then(() => {
      this.props.onCloseEdit();
    });
  }

  onUpdateFilter(data) {
    const { parentMutator } = this.props;
    parentMutator.tableQuery.update({ filter:data });
  }
}

export default LedgerView;
