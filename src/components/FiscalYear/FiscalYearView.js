import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FormattedDate, FormattedMessage } from 'react-intl';
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

import FiscalYearPane from './FiscalYearPane';
import ConnectionListing from '../ConnectionListing';

class FiscalYearView extends Component {
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
    onClose: PropTypes.func,
    paneWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { parentMutator, parentResources, match: { params: { id } } } = nextProps;
    const queryData = () => {
      parentMutator.fiscalyearQuery.replace(`query=(id="${id}")`);
      parentMutator.ledgerQuery.replace(`query=(fiscalYears="${id}")`);
      parentMutator.budgetQuery.replace(`query=(fiscalYearId="${id}")`);
    };

    if (!_.isEqual(prevState.viewID, id)) {
      queryData();
      const ledger = (parentResources.ledger || {}).records || [];
      const budget = (parentResources.budget || {}).records || [];
      const fiscalyear = (parentResources.fiscalyear || {}).records || [];
      return { viewID: id, ledgerData: ledger, budgetData: budget, fiscalyearData: fiscalyear };
    }

    if (parentResources || (parentResources.ledger && parentResources.budget)) {
      if (!_.isEqual(prevState.ledgerData, parentResources.ledger.records)) {
        parentMutator.ledgerQuery.replace(`query=(fiscalYears="${id}")`);
        const ledger = (parentResources.ledger || {}).records || [];
        return { ledgerData: ledger };
      }
      if (!_.isEqual(prevState.budgetData, parentResources.budget.records)) {
        parentMutator.budgetQuery.replace(`query=(fiscalYearId="${id}")`);
        const budget = (parentResources.budget || {}).records || [];
        return { budgetData: budget };
      }
    }
    return false;
  }

  constructor(props) {
    super(props);
    this.state = {
      isRemoveConfirmationVisible: false,
    };
    this.getData = this.getData.bind(this);
    this.getLedger = this.getLedger.bind(this);
    this.getBudget = this.getBudget.bind(this);
    this.connectedFiscalYearPane = this.props.stripes.connect(FiscalYearPane);
  }

  componentWillUnmount() {
    const { parentMutator } = this.props;
    parentMutator.ledgerQuery.replace('query=(fiscalYears=null)');
    parentMutator.budgetQuery.replace('query=(fiscalYearId=null)');
  }

  getData() {
    const { parentResources, match: { params: { id } } } = this.props;
    const records = (parentResources.fiscalyear || {}).records || [];
    const selectData = records.length > 0 ? records : this.state.fiscalyearData;
    const fiscalyearData = !_.isEmpty(selectData) ? selectData : [];
    //  If no ID return null
    if (!id) return null;
    const data = fiscalyearData.find(u => u.id === id);
    return data;
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

  toggleRemoveConfirmation = () => this.setState((state) => {
    return { isRemoveConfirmationVisible: !state.isRemoveConfirmationVisible };
  });

  update(data) {
    this.props.parentMutator.records.PUT(data).then(() => {
      this.props.onCloseEdit();
    });
  }

  remove = () => {
    const { parentMutator } = this.props;
    const fiscalYear = this.getData();

    this.toggleRemoveConfirmation();
    parentMutator.records.DELETE(fiscalYear).then(() => {
      parentMutator.query.update({
        _path: '/finance/fiscalyear',
        layer: null,
      });
    });
  };

  renderActionMenu = ({ onToggle }) => {
    return (
      <MenuSection id="fiscalyear-details-actions">
        <DetailsEditAction
          perm="finance-storage.fiscal-years.item.put"
          onEdit={this.props.onEdit}
          toggleActionMenu={onToggle}
        />
        <DetailsRemoveAction
          perm="finance-storage.fiscal-years.item.delete"
          toggleActionMenu={onToggle}
          onRemove={this.toggleRemoveConfirmation}
          disabled={Boolean(this.getLedger()) || Boolean(this.getBudget())}
        />
      </MenuSection>
    );
  };

  render() {
    const { isRemoveConfirmationVisible } = this.state;
    const { location } = this.props;
    const initialValues = this.getData();
    const query = location.search ? queryString.parse(location.search) : {};

    const isLedgerData = this.getLedger() || false;
    const isBudgetData = this.getBudget() || false;
    if (!initialValues) {
      return (
        <Pane
          id="pane-fiscalyeardetails"
          defaultWidth={this.props.paneWidth}
          paneTitle={<FormattedMessage id="ui-finance.fiscalyear.paneTitle" />}
          dismissible
          onClose={this.props.onClose}
        >
          <div style={{ paddingTop: '1rem' }}>
            <Icon icon="spinner-ellipsis" width="100px" />
          </div>
        </Pane>
      );
    }

    return (
      <Pane
        id="pane-fiscalyeardetails"
        defaultWidth={this.props.paneWidth}
        actionMenu={this.renderActionMenu}
        paneTitle={_.get(initialValues, ['name'], '')}
        dismissible
        onClose={this.props.onClose}
      >
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-finance.fiscalyear.name" />} value={_.get(initialValues, ['name'], '')} />
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-finance.fiscalyear.code" />} value={_.toString(_.get(initialValues, ['code'], ''))} />
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-finance.fiscalyear.description" />} value={_.get(initialValues, ['description'], '')} />
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-finance.fiscalyear.periodBeginDate" />}>
              <FormattedDate value={initialValues.startDate} />
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-finance.fiscalyear.periodEndDate" />}>
              <FormattedDate value={initialValues.endDate} />
            </KeyValue>
          </Col>
          {
            isLedgerData &&
            <Col xs={12}>
              <hr />
              <ConnectionListing
                title={<FormattedMessage id="ui-finance.fiscalyear.ledgerConnection" />}
                isEmptyMessage={<FormattedMessage id="ui-finance.fiscalyear.noItemsFound" />}
                items={this.getLedger()}
                path="/finance/fiscalyear/view/"
                isView
              />
            </Col>
          }
          {
            isBudgetData &&
            <Col xs={12}>
              <hr />
              <ConnectionListing
                title={<FormattedMessage id="ui-finance.fiscalyear.budgetConnection" />}
                isEmptyMessage={<FormattedMessage id="ui-finance.fiscalyear.noItemsFound" />}
                items={this.getBudget()}
                path="/finance/budget/view/"
                isView
              />
            </Col>
          }
        </Row>
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label={<FormattedMessage id="ui-finance.fiscalyear.EditFiscalYearDialog" />}>
          <this.connectedFiscalYearPane
            stripes={this.props.stripes}
            initialValues={initialValues}
            onSubmit={(record) => { this.update(record); }}
            onCancel={this.props.onCloseEdit}
            parentResources={this.props.parentResources}
            parentMutator={this.props.parentMutator}
            ledgerData={this.getLedger()}
            budgetData={this.getBudget()}
          />
        </Layer>

        {isRemoveConfirmationVisible && (
          <ConfirmationModal
            id="fiscal-year-remove-confirmation"
            confirmLabel={<FormattedMessage id="ui-finance.actions.remove.confirm" />}
            heading={<FormattedMessage id="ui-finance.fiscalyear.remove.heading" />}
            message={<FormattedMessage id="ui-finance.fiscalyear.remove.message" />}
            onCancel={this.toggleRemoveConfirmation}
            onConfirm={this.remove}
            open
          />
        )}
      </Pane>
    );
  }
}

export default withTags(FiscalYearView);
