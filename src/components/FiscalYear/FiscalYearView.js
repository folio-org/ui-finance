import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Layer, Pane, PaneMenu, Icon, IconButton, IfPermission, KeyValue, Row, Col } from '@folio/stripes-components';
import { withTags } from '@folio/stripes-smart-components/lib/Tags';
import FiscalYearPane from './FiscalYearPane';
import ConnectionListing from '../ConnectionListing';
import FormatDate from '../../Utils/FormatDate';

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
    editLink: PropTypes.string,
    onClose: PropTypes.func,
    paneWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    notesToggle: PropTypes.func,
    tagsToggle: PropTypes.func,
    tagsEnabled: PropTypes.bool
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { parentMutator, parentResources, match: { params: { id } } } = nextProps;
    const queryData = () => {
      parentMutator.ledgerQuery.replace(`query=(fiscal_years="${id}")`);
      parentMutator.budgetQuery.replace(`query=(fiscal_year_id="${id}")`);
    };

    if (!_.isEqual(prevState.viewID, id)) {
      queryData();
      const ledger = (parentResources.ledger || {}).records || [];
      const budget = (parentResources.budget || {}).records || [];
      return { viewID: id, ledgerData: ledger, budgetData: budget };
    }

    if (parentResources || (parentResources.ledger && parentResources.budget)) {
      if (!_.isEqual(prevState.ledgerData, parentResources.ledger.records)) {
        parentMutator.ledgerQuery.replace(`query=(fiscal_years="${id}")`);
        const ledger = (parentResources.ledger || {}).records || [];
        return { ledgerData: ledger };
      }
      if (!_.isEqual(prevState.budgetData, parentResources.budget.records)) {
        parentMutator.budgetQuery.replace(`query=(fiscal_year_id="${id}")`);
        const budget = (parentResources.budget || {}).records || [];
        return { budgetData: budget };
      }
    }
    return false;
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.getData = this.getData.bind(this);
    this.getLedger = this.getLedger.bind(this);
    this.getBudget = this.getBudget.bind(this);
    this.connectedFiscalYearPane = this.props.stripes.connect(FiscalYearPane);
  }

  componentWillUnmount() {
    const { parentMutator } = this.props;
    parentMutator.ledgerQuery.replace('query=(fiscal_years=null)');
    parentMutator.budgetQuery.replace('query=(fiscal_year_id=null)');
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

  render() {
    const { location, tagsEnabled } = this.props;
    const initialValues = this.getData();
    const query = location.search ? queryString.parse(location.search) : {};
    const tags = ((initialValues && initialValues.tags) || {}).tagList || [];
    const detailMenu = (
      <PaneMenu>
        {
          tagsEnabled && 
          <IconButton
            icon="tag"
            title="showTags"
            id="clickable-show-tags"
            onClick={this.props.tagsToggle}
            badgeCount={tags.length}
            aria-label="showTags"
          />
        }
        <IconButton
          icon="comment"
          id="clickable-show-notes"
          onClick={this.props.notesToggle}
          aria-label="showNotes"
        />
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
      </PaneMenu>
    );
    const isLedgerData = this.getLedger() || false;
    const isBudgetData = this.getBudget() || false;
    const startDate = FormatDate(_.get(initialValues, ['period_start'], ''));
    const endDate = FormatDate(_.get(initialValues, ['period_end'], ''));

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
          <Col xs={4}>
            <KeyValue label="Name" value={_.get(initialValues, ['name'], '')} />
          </Col>
          <Col xs={4}>
            <KeyValue label="Code" value={_.toString(_.get(initialValues, ['code'], ''))} />
          </Col>
          <Col xs={4}>
            <KeyValue label="Description" value={_.get(initialValues, ['description'], '')} />
          </Col>
          <Col xs={4}>
            <KeyValue label="Period Begin Date" value={startDate} />
          </Col>
          <Col xs={4}>
            <KeyValue label="Period End Date" value={endDate} />
          </Col>
          {
            isLedgerData &&
            <Col xs={12}>
              <hr />
              <ConnectionListing
                title="Ledger Connection"
                isEmptyMessage="No items found"
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
                title="Budget Connection"
                isEmptyMessage="No items found"
                items={this.getBudget()}
                path="/finance/budget/view/"
                isView
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
          />
        </Layer>
      </Pane>
    );
  }
}

export default withTags(FiscalYearView);
