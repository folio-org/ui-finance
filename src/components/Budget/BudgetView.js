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
import craftLayerUrl from '@folio/stripes-components/util/craftLayerUrl';
import BudgetPane from './BudgetPane';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import TableSortAndFilter from '../TableSortAndFilter';


class BudgetView extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    onCloseEdit: PropTypes.func,
    parentResources: PropTypes.shape({}),
    parentMutator: PropTypes.shape({}),
  }

  constructor(props) {
    super(props);
    this.state = {
      viewID: '',
      fundID: null,
      fyID: null
    };
    this.getData = this.getData.bind(this);
    this.getFiscalYears = this.getFiscalYears.bind(this);
    this.getFund = this.getFund.bind(this);
    this.onCloseTransaction = this.onCloseTransaction.bind(this);
    this.connectedTableSortAndFilter = this.props.stripes.connect(TableSortAndFilter);
    this.connectedBudgetPane = this.props.stripes.connect(BudgetPane);
    this.craftLayerUrl = craftLayerUrl.bind(this);
    this.transitionToParams = transitionToParams.bind(this);
    this.openTransactionLayer = this.openTransactionLayer.bind(this);
    
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { parentMutator, parentResources, match: { params: { id } } } = nextProps;
    if(parentResources && (parentResources.fundID || parentResources.fiscalyearID)) {
      if(!_.isEqual(prevState.viewID, id)) {
        parentMutator.queryCustom.update({ budgetIDQuery: `query=(id="${id}")` });
        return { viewID:id };
      }

      const budget = parentResources.records.records;
      const data = budget !== null ? budget.find(u => u.id === id) : false;
      if (data) {
        const fundID = data.fund_id;
        const fyID = data.fiscal_year_id;
        if(!_.isEqual(prevState.fundID, fundID) || !_.isEqual(prevState.fyID, fyID)) {
          parentMutator.queryCustom.update({
            fundQueryID: `query=(id="${fundID}")`,
            fiscalyearQueryID: `query=(id="${fyID}")`
          });
          return { fyID, fundID };
        }
      }
    }
    return false;
  }
  
  componentWillUnmount(){
    const { parentMutator, parentResources, match: { params: { id } } } = this.props;
    parentMutator.queryCustom.update({
      budgetIDQuery:`query=(id=null)`,
      fundQueryID:`query=(id=null)`,
      fiscalyearQueryID:`query=(id=null)`,
    });
  }
  
  render() {
    const initialValues = this.getData();
    const query = location.search ? queryString.parse(location.search) : {};
    const detailMenu = (<PaneMenu>
      <Button
        id="clickable-viewtransaction"
        onClick={this.openTransactionLayer}
        title={`Transactions View`}
        buttonStyle="primary paneHeaderNewButton"
        marginBottom0
      >
        Transctions
      </Button>
      <IfPermission perm="budget.item.put">
        <IconButton
          icon="edit"
          id="clickable-editbudget"
          style={{ visibility: !initialValues ? 'hidden' : 'visible' }}
          onClick={this.props.onEdit}
          href={this.props.editLink}
          title="Edit Budget"
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
      { 'title': "id", 'status': true, },
      { 'title': "allocated", 'status': true, },
      { 'title': "amount", 'status': true, },
      { 'title': "awaiting_payment", 'status': true, },
      { 'title': "encumbered", 'status': true, },
      { 'title': "expenditures", 'status': true, },
      { 'title': "note", 'status': true, },
      { 'title': "timestamp", 'status': true, },
      { 'title': "source_id", 'status': true, },
      { 'title': "transaction_type", 'status': true, },
      { 'title': "budget_id", 'status': true, },
    ];

    const columnMapping = {
      id: 'ID',
      allocated: 'Allocated',
      amount: 'Amount',
      awaiting_payment: 'Awaiting Payment',
      encumbered: 'Encumbered',
      expenditures: 'Expenditures',
      note: 'Note',
      timestamp: 'Timestamp',
      source_id: 'Source ID',
      transaction_type: 'Transaction Type',
      budget_id: 'Budget ID',
    };

    if (!initialValues) {
      return (
        <Pane id="pane-budgetdetails" defaultWidth={this.props.paneWidth} paneTitle="Budget View" lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
          <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
        </Pane>
      );
    }

    return (
      <Pane id="pane-budgetdetails" defaultWidth={this.props.paneWidth} paneTitle={_.get(initialValues, ['name'], '')} lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
        <Row>
          <Col xs={3}>
            <KeyValue label="name" value={_.get(initialValues, ['name'], '')} />
          </Col>
          <Col xs={3}>
            <KeyValue label="code" value={_.toString(_.get(initialValues, ['code'], ''))} />
          </Col>
          <Col xs={3}>
            <KeyValue label="fiscal year" value={this.getFiscalYears()} />
          </Col>
          <Col xs={3}>
            <KeyValue label="fund" value={this.getFund()} />
          </Col>
        </Row>
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label="Edit Budget Dialog">
          <this.connectedBudgetPane
            stripes={this.props.stripes}
            initialValues={initialValues}
            onSubmit={(record) => { this.update(record); }}
            onCancel={this.props.onCloseEdit}
            parentResources={this.props.parentResources}
            parentMutator={this.props.parentMutator}
          />
        </Layer>
        <Layer isOpen={query.layer ? query.layer === 'transaction' : false} label="Transaction's Dialog">
          <this.connectedTableSortAndFilter
            paneWidth={'40%'}
            resourceName="tableRecords"
            tableInitCountName="queryCustom.tableCount"
            heading="Transactions"
            stripes={this.props.stripes}
            filterConfig={filterConfig}
            onClose={this.onCloseTransaction}
            visibleColumnsConfig={visibleColumnsConfig}
            // formatter={formatter}
            columnMapping={columnMapping}
            onUpdateFilter={this.onUpdateFilter}
            parentResources={this.props.parentResources}
            parentMutator={this.props.parentMutator}
          />
        </Layer>
      </Pane>
    )
  }

  getData() {
    const { parentResources, match: { params: { id } } } = this.props;
    const budget = (parentResources.records || {}).records || [];
    if (!budget || budget.length === 0 || !id) return null;
    return budget.find(u => u.id === id);
  }

  getFiscalYears = () => {
    const { parentResources, match: { params: { id } } } = this.props;
    const fiscalYears = (parentResources.fiscalyearID || {}).records || [];
    if (!fiscalYears || fiscalYears.length === 0) return null;
    return (
      <span>{_.get(fiscalYears[0], ['name'], '')}</span>
    )
  }

  getFund = () => {
    const { parentResources } = this.props;
    const data = (parentResources.fundID || {}).records || [];
    if (!data || data.length === 0) return null;
    return (
      <span>{_.get(data[0], ['name'], '')}</span>
    )
  }

  update(data) {
    const fiscalID = data.fiscal_year_id;
    const fundID = data.fund_id;
    if(fiscalID == ''  || fiscalID == null) {
      data['fiscal_year_id'] = null;
    }
    if(fundID == ''  || fundID == null) {
      data['fund_id'] = null;
    }
    this.props.parentMutator.records.PUT(data).then(() => {
      this.props.onCloseEdit();
    });
  }

  openTransactionLayer() {
    this.transitionToParams({ layer: 'transaction' });
  }

  onCloseTransaction() {
    this.props.parentMutator.query.update({
      layer: null
    });
    this.transitionToParams({ layer: null });
  }
}

export default BudgetView;
