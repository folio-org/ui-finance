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
import FundPane from './FundPane';
import ConnectionListing from '../ConnectionListing';

class FundView extends Component {
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
      budgetData: [],
    };
    this.getData = this.getData.bind(this);
    this.getBudget = this.getBudget.bind(this);
    this.connectedFundPane = this.props.stripes.connect(FundPane);
    this.getLedger = this.getLedger.bind(this);
  }

  componentDidMount() {
    this.setState({ viewID:'' });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { parentMutator, parentResources, match: { params: { id } } } = nextProps;
    const fundID = () => {
      const fund = (parentResources.records || {}).records || [];
      if (!fund || fund.length === 0 || !id) return null;
      const newFund = fund.find(u => u.id === id);
      return newFund.ledger_id;
    }

    let queryData = () => {
      parentMutator.queryCustom.update({
        budgetQuery:`query=(fund_id="${id}")`,
        ledgerIDQuery:`query=(id="${fundID()}")`,
      });
    }
    
    if(parentResources && (parentResources.budget || parentResources.ledgerID)) {
      if(!_.isEqual(prevState.viewID, id)) {
        queryData();
        return { viewID:id };
      }

      if(!_.isEqual(prevState.budgetData, parentResources.budget.records)) {
        queryData();
        let budget = (parentResources.budget || {}).records || [];
        return { budgetData: budget };
      }
    }
    return false;
  }
  
  componentWillUnmount(){
    const { parentMutator, parentResources, match: { params: { id } } } = this.props;
    parentMutator.queryCustom.update({ budgetQuery: `query=(fund_id=null)` });
  }

  render() {
    const initialValues = this.getData();
    const query = location.search ? queryString.parse(location.search) : {};
    const detailMenu = (<PaneMenu>
      <IfPermission perm="fund.item.put">
        <IconButton
          icon="edit"
          id="clickable-editfund"
          style={{ visibility: !initialValues ? 'hidden' : 'visible' }}
          onClick={this.props.onEdit}
          href={this.props.editLink}
          title="Edit Fund"
        />
      </IfPermission>
    </PaneMenu>);
    const isBudgetData = this.getBudget() !== null ? true : false;

    if (!initialValues) {
      return (
        <Pane id="pane-funddetails" defaultWidth={this.props.paneWidth} paneTitle="This is fiscal year view" lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
          <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
        </Pane>
      );
    }

    return (
      <Pane id="pane-funddetails" defaultWidth={this.props.paneWidth} paneTitle={_.get(initialValues, ['name'], '')} lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
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
          <Col xs={3}>
            <KeyValue label="Ledger" value={this.getLedger()} />
          </Col>
          <Col xs={3}>
            <KeyValue label="currency" value={_.get(initialValues, ['currency'], '')} />
          </Col>
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
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label="Edit Fund Dialog">
          <this.connectedFundPane
            stripes={this.props.stripes}
            initialValues={initialValues}
            onSubmit={(record) => { this.update(record); }}
            onCancel={this.props.onCloseEdit}
            parentResources={this.props.parentResources}
            parentMutator={this.props.parentMutator}
            budgetData={this.getBudget()}
            isBudgetData={isBudgetData}
          />
        </Layer>
      </Pane>
    )
  }

  getData() {
    const { parentResources, match: { params: { id } } } = this.props;
    const fund = (parentResources.records || {}).records || [];
    if (!fund || fund.length === 0 || !id) return null;
    return fund.find(u => u.id === id);
  }

  getBudget() {
    const { parentResources } = this.props;
    const data = (parentResources.budget || {}).records || [];
    if (!data || data.length === 0) return null;
    return data;
  }

  getLedger = () => {
    const { parentResources } = this.props;
    const data = (parentResources.ledgerID || {}).records || [];
    if (!data || data.length === 0) return null;
    const newData = data[0];
    return (
      <span>{_.get(newData, ['name'], '')}</span>
    )
  }

  update(data) {
    const id = data.ledger_id;
    if(id == ''  || id == null) {
      data['ledger_id'] = null;
    }
    
    this.props.parentMutator.records.PUT(data).then(() => {
      this.props.onCloseEdit();
    });
  }
}

export default FundView;
