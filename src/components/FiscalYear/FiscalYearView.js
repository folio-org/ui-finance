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
import FiscalYearPane from './FiscalYearPane';
import ConnectionListing from '../ConnectionListing';

var num=0;
class FiscalYearView extends Component {
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
      ledgerData: [],
      budgetData: []
    };
    this.getData = this.getData.bind(this);
    this.getLedger = this.getLedger.bind(this);
    this.getBudget = this.getBudget.bind(this);
    this.connectedFiscalYearPane = this.props.stripes.connect(FiscalYearPane);
  }

  componentDidMount() {
    this.setState({ viewID:''});
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { parentMutator, parentResources, match: { params: { id } } } = nextProps;
    let queryData = () => {
      parentMutator.ledgerQuery.update({ id: `query=(fiscal_years="${id}")`});
      parentMutator.budgetQuery.update({ id: `query=(fiscal_year_id="${id}")`});
    }

    if(!_.isEqual(prevState.viewID, id)) {
      queryData();
      let ledger = (parentResources.ledger || {}).records || [];
      let budget = (parentResources.budget || {}).records || [];
      return { viewID:id, ledgerData: ledger, budgetData: budget };
    }

    if  (parentResources || (parentResources.ledger && parentResources.budget)) {
      if(!_.isEqual(prevState.ledgerData, parentResources.ledger.records)) {
        parentMutator.ledgerQuery.update({ id: `query=(fiscal_years="${id}")`});
        let ledger = (parentResources.ledger || {}).records || [];
        return { ledgerData: ledger };
      }
      if(!_.isEqual(prevState.budgetData, parentResources.budget.records)) {
        parentMutator.budgetQuery.update({ id: `query=(fiscal_year_id="${id}")`}); 
        let budget = (parentResources.budget || {}).records || [];
        return { budgetData: budget };
      }
    }
    return false;
  }

  componentWillUnmount(){
    const { parentMutator, parentResources, match: { params: { id } } } = this.props;
    parentMutator.ledgerQuery.update({ id: `query=(fiscal_years=null)`});
    parentMutator.budgetQuery.update({ id: `query=(fiscal_year_id=null)`});
  }

  render() {
    console.log(this.state);
    const initialValues = this.getData();
    const query = location.search ? queryString.parse(location.search) : {};
    const detailMenu = (<PaneMenu>
      <IfPermission perm="fiscal_year.item.put">
        <IconButton
          icon="edit"
          id="clickable-editfiscalyear"
          style={{ visibility: !initialValues ? 'hidden' : 'visible' }}
          onClick={this.props.onEdit}
          href={this.props.editLink}
          title="Edit Fiscal Year"
        />
      </IfPermission>
    </PaneMenu>);
    const isLedgerData = this.getLedger() !== null ? true : false;
    const isBudgetData = this.getBudget() !== null ? true : false;

    if (!initialValues) {
      return (
        <Pane id="pane-fiscalyeardetails" defaultWidth={this.props.paneWidth} paneTitle="This is fiscal year view" lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
          <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
        </Pane>
      );
    }

    return (
      <Pane id="pane-fiscalyeardetails" defaultWidth={this.props.paneWidth} paneTitle={_.get(initialValues, ['name'], '')} lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
        <Row>
          <Col xs={3}>
            <KeyValue label="name" value={_.get(initialValues, ['name'], '')} />
          </Col>
          <Col xs={3}>
            <KeyValue label="code" value={_.toString(_.get(initialValues, ['code'], ''))} />
          </Col>
          <Col xs={3}>
            <KeyValue label="Description" value={_.get(initialValues, ['description'], '')} />
          </Col>
          {
            isLedgerData &&
            <Col xs={12}>
              <hr />
              <ConnectionListing
                title={'Ledger Connection'}
                isEmptyMessage={'"No items found"'}
                items={this.getLedger()}
                isView={true}
                path={'/finance/fiscalyear/view/'}
              />
            </Col>
          }
          {
            isBudgetData &&
            <Col xs={12}>
              <hr />
              <ConnectionListing
                title={'Budget Connection'}
                isEmptyMessage={'"No items found"'}
                items={this.getBudget()}
                isView={true}
                path={'/finance/budget/view/'}
              />
            </Col>
          }
        </Row>
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label="Edit Fiscal Year Dialog">
          <this.connectedFiscalYearPane
            stripes={this.props.stripes}
            initialValues={initialValues}
            onSubmit={(record) => { this.update(record); }}
            onCancel={this.props.onCloseEdit}
            parentResources={this.props.parentResources}
            parentMutator={this.props.parentMutator}
            ledgerData={this.getLedger()}
            budgetData={this.getBudget()}
            isLedgerData={isLedgerData}
            isBudgetData={isBudgetData}
          />
        </Layer>
      </Pane>
    )
  }

  getData() {
    const { parentResources, match: { params: { id } } } = this.props;
    const fiscalyear = (parentResources.records || {}).records || [];
    if (!fiscalyear || fiscalyear.length === 0 || !id) return null;
    return fiscalyear.find(u => u.id === id);
  }

  getLedger() {
    const { parentResources, match: { params: { id } } } = this.props;
    const ledger = (parentResources.ledger || {}).records || [];
    if (!ledger || ledger.length === 0 || !id) return null;
    return ledger;
  }

  getBudget() {
    const { parentResources, match: { params: { id } } } = this.props;
    const budget = (parentResources.budget || {}).records || [];
    if (!budget || budget.length === 0 || !id) return null;
    return budget;
  }

  update(data) {
    this.props.parentMutator.records.PUT(data).then(() => {
      this.props.onCloseEdit();
    });
  }
}

export default FiscalYearView;
