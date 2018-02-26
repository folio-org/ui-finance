import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import _ from 'lodash';
import PropTypes from 'prop-types';
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

class LedgerView extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    parentResources: PropTypes.shape({}),
    parentMutator: PropTypes.shape({}),
  }

  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.getFiscalYears = this.getFiscalYears.bind(this);
  }

  render() {
    console.log(this.props);
    const initialValues = this.getData();
    const fiscalYears = initialValues !== null ? initialValues.fiscal_years : [];
    const detailMenu = (<PaneMenu>
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
    </PaneMenu>);
    return (
      <Pane id="pane-ledgerdetails" defaultWidth={this.props.paneWidth} paneTitle={_.get(initialValues, ['name'], '')} lastMenu={detailMenu} dismissible onClose={this.props.onClose}>
        <Row>
          <Col xs={3}>
            <KeyValue label="name" value={_.get(initialValues, ['name'], '')} />
          </Col>
          <Col xs={3}>
            <KeyValue label="code" value={_.get(initialValues, ['code'], '')} />
          </Col>
          <Col xs={3}>
            <KeyValue label="period start" value={_.get(initialValues, ['period_start'], '')} />
          </Col>
          <Col xs={3}>
            <KeyValue label="period end" value={_.get(initialValues, ['period_end'], '')} />
          </Col>
          <Col xs={12}>
            <KeyValue label="Fiscal Year" value={fiscalYears.map((e, i) => this.getFiscalYears(e, i))} />
          </Col>
        </Row>
      </Pane>
    )
  }

  getData() {
    const { parentResources, match: { params: { id } } } = this.props;
    const ledgers = (parentResources.records || {}).records || [];
    if (!ledgers || ledgers.length === 0 || !id) return null;
    // Logging below shows this DOES sometimes find the wrong record. But why?
    // console.log(`getUser: found ${ledgers.length} users, id '${ledgers[0].id}' ${ledgers[0].id === id ? '==' : '!='} '${id}'`);
    return ledgers.find(u => u.id === id);
  }

  getFiscalYears = (e, i) => {
    const { parentResources } = this.props;
    const fiscalYears = (parentResources.fiscalYear || {}).records || [];
    if (!fiscalYears || fiscalYears.length === 0) return null;
    
    let data = fiscalYears.find(u => u.id === e);
    if (!data || data.length === 0) return null;
    return (
      <p key={i}>{_.get(data, ['code'], '')}, {_.get(data, ['name'], '')}, {_.get(data, ['description'], '')}</p>
    )
  }
}

export default LedgerView;
