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
    this.getData = this.getData.bind(this);
    this.connectedFiscalYearPane = this.props.stripes.connect(FiscalYearPane);
    // Connections
    this.checkLedger = this.checkLedger.bind(this);
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
    const ledgerData = this.checkLedger();
    const budgetData = this.checkBudget();

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
            ledgerData &&
            <Col xs={12}>
              <hr />
              <ConnectionListing
                title={'Ledger Connection'}
                isEmptyMessage={'"No items found"'}
                items={ledgerData}
                isView={true}
                path={'/finance/fiscalyear/view/'}
              />
            </Col>
          }
          {
            budgetData &&
            <Col xs={12}>
              <hr />
              <ConnectionListing
                title={'Budget Connection'}
                isEmptyMessage={'"No items found"'}
                items={budgetData}
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
            ledgerData={ledgerData}
            budgetData={budgetData}
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

  checkLedger = () => {
    const { parentResources } = this.props;
    const data = (parentResources.ledger || {}).records || [];
    if (!data || data.length === 0) return null;
    return data;
  }

  checkBudget = () => {
    const { parentResources } = this.props;
    const data = (parentResources.budget || {}).records || [];
    if (!data || data.length === 0) return null;
    console.log(data);
    return data;
  }

  update(data) {
    this.props.parentMutator.records.PUT(data).then(() => {
      this.props.onCloseEdit();
    });
  }
}

export default FiscalYearView;
