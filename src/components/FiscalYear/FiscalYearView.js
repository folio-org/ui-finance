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
      ledgerData: {},
      budgetData: {},
      initialData: {}
    };
    this.getData = this.getData.bind(this);
    this.connectedFiscalYearPane = this.props.stripes.connect(FiscalYearPane);
    // Connections
    const isFundData = this.props.checkFund !== null ? true : false;
  }

  componentDidMount() {
    const { parentMutator, parentResources } = this.props;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps);
    const { parentMutator, parentResources } = nextProps;
    if (parentResources !== null && parentResources.ledger !== null) {
      if(nextPRops.initialData) {
        if (!_.isEqual(prevState.ledgerData, parentResources.ledger.records) || !_.isEqual(prevState.budgetData, parentResources.budget.records)) {
          parentMutator.ledgerQuery.update({ id: `query=(fiscal_years="${nextProps.initialData.id}")`});
          parentMutator.budgetQuery.update({ id: `query=(fiscal_year_id="${nextProps.initialData.id}")`});
          return { ledgerData: parentResources.ledger.records, budgetData: parentResources.budget.records };
        }
      }
    }
    return false;
  }

  render() {
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
    const isLedgerData = this.state.ledgerData !== null && this.state.ledgerData.length > 0 ? true : false;
    const isBudgetData = this.state.budgetData !== null && this.state.budgetData.length > 0 ? true : false;

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
                items={this.state.ledgerData}
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
                items={this.state.budgetData}
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
            ledgerData={this.state.ledgerData}
            budgetData={this.state.budgetData}
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

  update(data) {
    this.props.parentMutator.records.PUT(data).then(() => {
      this.props.onCloseEdit();
    });
  }
}

export default FiscalYearView;
