import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import {
  Layer,
  Pane,
  MenuSection,
  Icon,
  KeyValue,
  Row,
  Col,
  ConfirmationModal,
} from '@folio/stripes/components';
import { withTags } from '@folio/stripes/smart-components';

import {
  DetailsEditAction,
  DetailsRemoveAction,
} from '../../common/DetailsActions';

import LedgerPane from './LedgerPane';
import ConnectionListing from '../ConnectionListing';

class LedgerView extends Component {
  static propTypes = {
    onCloseEdit: PropTypes.func,
    parentResources: PropTypes.shape({}),
    parentMutator: PropTypes.shape({}),
    location: PropTypes.object,
    onEdit: PropTypes.func,
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
      const ledgerData = (parentResources.ledgerID || {}).records || [];
      const recordsData = (parentResources.records || {}).records || [];
      const recordsItem = recordsData.find(u => u.id === id) || ledgerData.find(u => u.id === id) || false;
      const fyIDs = recordsItem.fiscalYears;
      // Query for Fiscal year
      const buildQueryFiscalYear = () => {
        let newStr;
        const arrStore = [];
        const fydata = recordsItem.fiscalYears;
        const fydataLength = fydata.length - 1;
        fydata.forEach((e, i) => {
          if (i === 0) {
            arrStore.push(`id="${e}"`);
          } else {
            arrStore.push(` or id="${e}"`);
          }
          if (fydataLength === i) {
            newStr = arrStore.join('');
          }
        });
        return newStr;
      };
      const fyQuery = !_.isEmpty(fyIDs) ? buildQueryFiscalYear() : null;
      // Conditions
      const isID = _.isEqual(id, state.id);
      const isFundData = _.isEqual(fundData, state.fundData);
      const isLedgerData = _.isEqual(ledgerData, state.ledgerData);
      const isFyIDs = _.isEqual(fyIDs, state.fyIDs);
      const isFyData = _.isEqual(fyData, state.fyData);
      // Mutate and save to state.
      if (!isID || !isFundData || !isFyIDs || !isFyData || !isLedgerData) {
        parentMutator.queryCustom.update({
          fundQuery: `query=(ledgerId="${id}*")`,
          ledgerIDQuery: `query=(id=${id})`,
          fiscalyearIDQuery: `query=(${fyQuery})`
        });
        return { id, fundData, fyIDs, fyData, ledgerData };
      }
    }
    return false;
  }

  constructor(props) {
    super(props);
    this.state = {
      isRemoveConfirmationVisible: false,
    };
    this.getFiscalYears = this.getFiscalYears.bind(this);
    this.connectedLedgerPane = this.props.stripes.connect(LedgerPane);
    this.onUpdateFilter = this.onUpdateFilter.bind(this);
    this.getFund = this.getFund.bind(this);
    this.getData = this.getData.bind(this);
  }

  getData() {
    const { parentResources, match: { params: { id } } } = this.props;
    const records = (parentResources.records || {}).records || [];
    const selectData = records.length > 0 ? records : this.state.ledgerData;
    const ledgerData = !_.isEmpty(selectData) ? selectData : [];
    //  If no ID return null
    if (!id) return null;
    const data = ledgerData.find(u => u.id === id);
    return data;
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

  toggleRemoveConfirmation = () => this.setState((state) => {
    return { isRemoveConfirmationVisible: !state.isRemoveConfirmationVisible };
  });

  update(ledgerdata) {
    const { parentMutator } = this.props;
    parentMutator.records.PUT(ledgerdata).then(() => {
      this.props.onCloseEdit();
    });
  }

  remove = () => {
    const { parentMutator } = this.props;
    const ledger = this.getData();

    this.toggleRemoveConfirmation();
    parentMutator.records.DELETE(ledger).then(() => {
      parentMutator.query.update({
        _path: '/finance/ledger',
        layer: null,
      });
    });
  };

  onUpdateFilter(data) {
    const { parentMutator } = this.props;
    parentMutator.tableQuery.update({ filter: data });
  }

  renderActionMenu = ({ onToggle }) => {
    return (
      <MenuSection id="finance-storage.ledgers.item.put">
        <DetailsEditAction
          perm="finance-storage.ledgers.item.put"
          onEdit={this.props.onEdit}
          toggleActionMenu={onToggle}
        />
        <DetailsRemoveAction
          perm="finance-storage.ledgers.item.delete"
          toggleActionMenu={onToggle}
          onRemove={this.toggleRemoveConfirmation}
          disabled={Boolean(this.getFund())}
        />
      </MenuSection>
    );
  };

  render() {
    const { isRemoveConfirmationVisible } = this.state;
    const { location } = this.props;
    const initialValues = this.getData();
    const query = location.search ? queryString.parse(location.search) : {};
    const isFundData = this.getFund() || false;

    if (!initialValues) {
      return (
        <Pane
          id="pane-ledgerdetails"
          defaultWidth={this.props.paneWidth}
          paneTitle="Details"
          dismissible
          onClose={this.props.onClose}
        >
          <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
        </Pane>
      );
    }

    return (
      <Pane
        id="pane-ledgerdetails"
        defaultWidth={this.props.paneWidth}
        actionMenu={this.renderActionMenu}
        paneTitle={_.get(initialValues, ['name'], '')}
        dismissible
        onClose={this.props.onClose}
      >
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-finance.ledger.name" />} value={_.get(initialValues, ['name'], '')} />
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-finance.ledger.code" />} value={_.get(initialValues, ['code'], '')} />
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-finance.ledger.status" />} value={_.get(initialValues, ['ledgerStatus'], '')} />
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-finance.ledger.fiscalyear" />} value={this.getFiscalYears()} />
          </Col>
          {
            isFundData &&
            <Col xs={12}>
              <hr />
              <ConnectionListing
                title={<FormattedMessage id="ui-finance.ledger.fundConnection" />}
                isEmptyMessage={<FormattedMessage id="ui-finance.ledger.noItemsFound" />}
                items={this.getFund()}
                path="/finance/fund/view/"
                isView
              />
            </Col>
          }
        </Row>
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label={<FormattedMessage id="ui-finance.ledger.editLayerDialog" />}>
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

        {isRemoveConfirmationVisible && (
          <ConfirmationModal
            id="ledger-remove-confirmation"
            confirmLabel={<FormattedMessage id="ui-finance.actions.remove.confirm" />}
            heading={<FormattedMessage id="ui-finance.ledger.remove.heading" />}
            message={<FormattedMessage id="ui-finance.ledger.remove.message" />}
            onCancel={this.toggleRemoveConfirmation}
            onConfirm={this.remove}
            open
          />
        )}
      </Pane>
    );
  }
}

export default withTags(LedgerView);
