import React, { Component } from 'react';
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
import TableSortAndFilter from '../TableSortAndFilter';


class LedgerView extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    onCloseEdit: PropTypes.func,
    parentResources: PropTypes.shape({}),
    parentMutator: PropTypes.shape({}),
  }

  constructor(props) {
    super(props);
    this.getFiscalYears = this.getFiscalYears.bind(this);
    this.connectedLedgerPane = this.props.stripes.connect(LedgerPane);
    this.connectedTableSortAndFilter = this.props.stripes.connect(TableSortAndFilter);
    this.onUpdateFilter = this.onUpdateFilter.bind(this);
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
    // Table Config
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
    const formatter = {
      name: data => _.get(data, ['name'], ''),
      vendor_status: data => _.get(data, ['vendor_status'], '')
    };

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
            <KeyValue label="period start" value={_.get(initialValues, ['period_start'], '')} />
          </Col>
          <Col xs={3}>
            <KeyValue label="period end" value={_.get(initialValues, ['period_end'], '')} />
          </Col>
          <Col xs={12}>
            <KeyValue label="Fiscal Year" value={initialValues.fiscal_years.map((e, i) => this.getFiscalYears(e, i))} />
          </Col>
          <Col xs={12}>
            <this.connectedTableSortAndFilter
              resourceName="tableRecords"
              tableInitCountName="queryCustom.tableCount"
              heading="Transactions"
              stripes={this.props.stripes}
              filterConfig={filterConfig}
              visibleColumnsConfig={visibleColumnsConfig}
              formatter={formatter}
              onUpdateFilter={this.onUpdateFilter}
              parentResources={this.props.parentResources}
              parentMutator={this.props.parentMutator}
            />
          </Col>
        </Row>
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label="Edit Ledger Dialog">
          <this.connectedLedgerPane
            stripes={this.props.stripes}
            initialValues={initialValues}
            onSubmit={(record) => { this.update(record); }}
            onCancel={this.props.onCloseEdit}
            parentResources={this.props.parentResources}
            parentMutator={this.props.parentMutator}
          />
        </Layer>
      </Pane>
    )
  }

  getData() {
    const { parentResources, match: { params: { id } } } = this.props;
    const ledgers = (parentResources.records || {}).records || [];
    if (!ledgers || ledgers.length === 0 || !id) return null;
    // Logging below shows this DOES sometimes find the wrong record. But why?
    // console.log(`getUser: found ${ledgers.length} users, id '${ledgers[0].id}' ${ledgers[0].id === id ? '==' : '!='} '${id}'`);
    return ledgers.find(u => u.id === id);  
  }

  getFiscalYears = (e, i) => {
    const { parentResources } = this.props;
    const fiscalYears = (parentResources.fiscalYear || {}).records || [];
    if (!fiscalYears || fiscalYears.length === 0) return null;
    
    let data = fiscalYears.find(u => u.id === e);
    if (!data || data.length === 0) return null;
    return (
      <p key={i}>{_.get(data, ['code'], '')}, {_.get(data, ['name'], '')}, {_.get(data, ['description'], '')}</p>
    )
  }

  update(ledgerdata) {
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
