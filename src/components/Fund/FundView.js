import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  Layer,
  Pane,
  PaneMenu,
  Icon,
  IconButton,
  IfPermission,
  KeyValue,
  Row,
  Col
} from '@folio/stripes/components';
import { withTags } from '@folio/stripes/smart-components';
import FundPane from './FundPane';
import ConnectionListing from '../ConnectionListing';

class FundView extends Component {
  static propTypes = {
    onCloseEdit: PropTypes.func,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }),
    stripes: PropTypes.object,
    location: PropTypes.object,
    onEdit: PropTypes.func,
    editLink: PropTypes.string,
    onClose: PropTypes.func,
    paneWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
  }

  static getDerivedStateFromProps(props, state) {
    const { parentMutator, parentResources, match: { params: { id } } } = props;
    const queryData = () => {
      parentMutator.queryCustom.update({
        budgetQuery: `query=(fund_id="${id}")`,
        fundQuery: `query=(id="${id}")`
      });
    };

    if ((parentResources || parentResources.records || parentResources.budget || parentResources.ledgerID || parentResources.fund)) {
      const records = (parentResources.records || {}).records || [];
      const fundData = (parentResources.fund || {}).records || [];
      const budgetData = (parentResources.budget || {}).records || [];
      const data = records.find(u => u.id === id) || fundData.find(u => u.id === id) || false;

      if (!_.isEqual(state.viewID, id) || !_.isEqual(state.budgetData, budgetData)) {
        queryData();
        return { viewID: id, budgetData, fundData };
      }

      if (data) {
        const ledgerID = data.ledger_id;
        if (!_.isEqual(state.ledgerID, ledgerID)) {
          parentMutator.queryCustom.update({
            ledgerIDQuery: `query=(id="${ledgerID}")`
          });
          return { ledgerID };
        }
      }
    }
    return false;
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.getData = this.getData.bind(this);
    this.getBudget = this.getBudget.bind(this);
    this.connectedFundPane = this.props.stripes.connect(FundPane);
    this.getLedger = this.getLedger.bind(this);
  }

  componentWillUnmount() {
    const { parentMutator } = this.props;
    parentMutator.queryCustom.update({ budgetQuery: 'query=(fund_id="null")' });
  }

  getData() {
    const { parentResources, match: { params: { id } } } = this.props;
    const records = (parentResources.records || {}).records || [];
    const selectData = records.length > 0 ? records : this.state.fundData;
    const fundData = !_.isEmpty(selectData) ? selectData : [];
    //  If no ID return null
    if (!id) return null;
    const data = fundData.find(u => u.id === id);
    return data;
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
    );
  }

  update(data) {
    let id = data.ledger_id;
    if (id === '' || id == null) {
      id = null;
    }

    this.props.parentMutator.records.PUT(data).then(() => {
      this.props.onCloseEdit();
    });
  }

  render() {
    const { location } = this.props;
    const initialValues = this.getData();
    const query = location.search ? queryString.parse(location.search) : {};
    const detailMenu = (
      <PaneMenu>
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
      </PaneMenu>
    );
    const isBudgetData = this.getBudget() || false;
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
            <KeyValue label="Name" value={_.get(initialValues, ['name'], '')} />
          </Col>
          <Col xs={3}>
            <KeyValue label="Code" value={_.toString(_.get(initialValues, ['code'], ''))} />
          </Col>
          <Col xs={3}>
            <KeyValue label="Ledger" value={this.getLedger()} />
          </Col>
          <Col xs={3}>
            <KeyValue label="Fund Status" value={_.get(initialValues, ['fund_status'], '')} />
          </Col>
          <Col xs={3}>
            <KeyValue label="Currency" value={_.get(initialValues, ['currency'], '')} />
          </Col>
          <Col xs={12}>
            <KeyValue label="Description" value={_.get(initialValues, ['description'], '')} />
          </Col>
          {
            isBudgetData &&
            <Col xs={12}>
              <hr />
              <ConnectionListing
                title="Budget Connection"
                isEmptyMessage="No items found"
                items={this.getBudget()}
                path="/finance/budget/view/"
                isView
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
          />
        </Layer>
      </Pane>
    );
  }
}


export default withTags(FundView);
