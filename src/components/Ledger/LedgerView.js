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
import LedgerPane from './LedgerPane';
import ConnectionListing from '../ConnectionListing';

class LedgerView extends Component {
  static propTypes = {
    onCloseEdit: PropTypes.func,
    parentResources: PropTypes.shape({}),
    parentMutator: PropTypes.shape({}),
    location: PropTypes.object,
    onEdit: PropTypes.func,
    editLink: PropTypes.string,
    onClose: PropTypes.func,
    dropdownFiscalyears: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })),
    stripes: PropTypes.object,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }),
    paneWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
  }

  static getDerivedStateFromProps(props, state) {
    const { parentMutator, parentResources, match: { params: { id } } } = props;
    if (parentResources || parentResources.records || parentResources.fund || parentResources.fiscalyearID) {
      const fundData = (parentResources.fund || {}).records || [];
      const fyData = (parentResources.fiscalyearID || {}).records || [];
      const ledgerData = (parentResources.records || {}).records || [];
      const ledgerItem = ledgerData.find(u => u.id === id) || false;
      const fyIDs = ledgerItem.fiscal_years;
      const isID = _.isEqual(id, state.id);

      console.log(id);

      if (!isID) return { id }; // Check ID
      if (!isID || !_.isEqual(fundData, state.fundData)) {
        parentMutator.queryCustom.update({ fundQuery: `query=(ledger_id="${id}*")` });
        console.log(fundData);
        return { fundData };
      }

      // if (isID && !_.isEqual(fyData, state.fyData)) {
      // }

      // if ((!_.isEqual(fundData, state.fundData) && !_.isEqual(fyData, state.fyData)) || (!_.isEqual(fyIDs, state.fyIDs) && !_.isEqual(id, state.id))) {
      //   // Mutate fund and fiscal year
      //   parentMutator.queryCustom.update({ fundQuery: `query=(ledger_id="${id}")` });
      //   // Build query Fiscal Year
      //   if (!_.isEmpty(fyIDs)) {
      //     const buildQueryFiscalYear = () => {
      //       console.log('this run buildQueryFiscalYear()');
      //       let newStr;
      //       const arrStore = [];
      //       const fydata = ledgerItem.fiscal_years;
      //       const fydataLength = fydata.length - 1;
      //       fydata.forEach((e, i) => {
      //         if (i === 0) {
      //           arrStore.push(`id="${e}"`);
      //         } else {
      //           arrStore.push(` or id="${e}"`);
      //         }
      //         if (fydataLength === i) {
      //           newStr = arrStore.join('');
      //         }
      //       });
      //       return newStr;
      //     };
      //     console.log(buildQueryFiscalYear());
      //     parentMutator.queryCustom.update({ fiscalyearIDQuery: `query=(${buildQueryFiscalYear()})` });
      //   }
      //   console.log('update all');
      //   return { fundData, fyData, fyIDs, id };
      // }
    }
    return false;
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.getFiscalYears = this.getFiscalYears.bind(this);
    this.connectedLedgerPane = this.props.stripes.connect(LedgerPane);
    this.onUpdateFilter = this.onUpdateFilter.bind(this);
    this.getFund = this.getFund.bind(this);
    this.getData = this.getData.bind(this);
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
    return data.map((item, i) => {
      return (
        <p key={i} style={{ margin: '0 0 5px' }}>
          {`${item.name}`}
        </p>
      );
    });
  }

  update(ledgerdata) {
    const { parentMutator } = this.props;
    parentMutator.records.PUT(ledgerdata).then(() => {
      this.props.onCloseEdit();
    });
  }

  onUpdateFilter(data) {
    const { parentMutator } = this.props;
    parentMutator.tableQuery.update({ filter: data });
  }

  render() {
    const { location } = this.props;
    const initialValues = this.getData();
    const query = location.search ? queryString.parse(location.search) : {};
    const isFundData = this.getFund() || false;
    const detailMenu = (
      <PaneMenu>
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
      </PaneMenu>
    );

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
          <Col xs={4}>
            <KeyValue label="Name" value={_.get(initialValues, ['name'], '')} />
          </Col>
          <Col xs={4}>
            <KeyValue label="Code" value={_.get(initialValues, ['code'], '')} />
          </Col>
          <Col xs={4}>
            <KeyValue label="Status" value={_.get(initialValues, ['ledger_status'], '')} />
          </Col>
          <Col xs={4}>
            <KeyValue label="Fiscal Year" value={this.getFiscalYears()} />
          </Col>
          {
            isFundData &&
            <Col xs={12}>
              <hr />
              <ConnectionListing
                title="Fund Connection"
                isEmptyMessage="No items found"
                items={this.getFund()}
                path="/finance/fund/view/"
                isView
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
          />
        </Layer>
      </Pane>
    );
  }
}

export default withTags(LedgerView);
