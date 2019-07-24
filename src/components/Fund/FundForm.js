import React, { Component } from 'react';
import { Field } from 'redux-form';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { IfPermission } from '@folio/stripes/core';
import {
  Button,
  Col,
  Row,
  Select,
  TextArea,
  TextField
} from '@folio/stripes/components';
import css from './css/FundForm.css';
import { Required } from '../../Utils/Validate';
import ConnectionListing from '../ConnectionListing';

const fundStatusDD = [
  { label: '-- Select --', value: '' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Frozen', value: 'Frozen' },
];
const acquisitionsUnitDD = [
  { value: '', label: 'No unit' },
];

class FundForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    deleteFund: PropTypes.func,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object,
    budgetData: PropTypes.arrayOf(PropTypes.object)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { parentResources, parentMutator } = nextProps;
    if (parentResources || parentResources.ledger) {
      const ledgerDD = parentResources.ledger.records;
      if (!_.isEqual(prevState.ledgerDD, ledgerDD)) {
        parentMutator.queryCustom.update({ ledgerQuery: 'query=(name="*")' });
        return { ledgerDD };
      }
    }
    return false;
  }

  constructor(props) {
    super(props);

    this.state = {};
    this.getLedger = this.getLedger.bind(this);
  }

  componentDidMount() {
    const { parentMutator } = this.props;
    parentMutator.queryCustom.update({
      budgetQuery: 'query=(name="*")',
      ledgerQuery: 'query=(name="*")'
    });
  }

  componentWillUnmount() {
    const { parentMutator } = this.props;
    parentMutator.queryCustom.update({
      ledgerQuery: 'query=(name=null)',
      budgetQuery: 'query=(fundId=null)',
      ledgerIDQuery: 'query=(id="*")'
    });
  }

  getLedger() {
    const { parentResources } = this.props;
    const ledgers = (parentResources.ledger || {}).records || [];
    if (!ledgers || ledgers.length === 0) return null;
    const newArr = [];
    newArr.push({ label: '-- Select a ledger --', value: '' });
    Object.keys(ledgers).map((key) => {
      const obj = {
        label: ledgers[key].name,
        value: _.toString(ledgers[key].id)
      };
      newArr.push(obj);
      if (Number(key) === ledgers.length) {
        return newArr;
      }
      return newArr;
    });
    return newArr;
  }

  budgetDataRender(data, i) {
    return (
      <li key={i}>
        <a href={`/finance/budget/view/${data.id}`}>{data.name}</a>
      </li>
    );
  }

  render() {
    const { initialValues, budgetData } = this.props;
    const isBudgetData = budgetData || false;
    const isEditPage = initialValues.id || false;

    return (
      <div style={{ margin: '0 auto', padding: '0' }} className={css.FundForm}>
        <Row>
          <Col xs={8} style={{ margin: '0 auto', padding: '0' }}>
            <Row>
              <Col xs={6}>
                <Field label="Name*" name="name" id="name" validate={[Required]} component={TextField} fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Code*" name="code" id="code" validate={[Required]} component={TextField} fullWidth />
              </Col>
              <Col xs={6} className={css.dateInputFix}>
                <Field
                  component={TextField}
                  label="External account No*"
                  name="externalAccountNo"
                  id="externalAccountNo"
                  validate={[Required]}
                />
              </Col>
              <Col xs={6}>
                <Field label="Fund Status*" name="fundStatus" id="fundStatus" component={Select} validate={[Required]} dataOptions={fundStatusDD} fullWidth />
              </Col>
              <Col xs={6}>
                <Field
                  label="Acquisitions unit"
                  name="acquisitionsUnit"
                  id="acquisitionsUnit"
                  component={Select}
                  dataOptions={acquisitionsUnitDD}
                  fullWidth
                />
              </Col>
              <Col xs={6}>
                <Field label="Ledger*" name="ledgerId" id="ledger" component={Select} validate={[Required]} dataOptions={this.getLedger()} fullWidth />
              </Col>
              <Col xs={12}>
                <Field label="Description" name="description" id="description" component={TextArea} fullWidth />
              </Col>
              <Col xs={6} style={{ display: 'none' }}>
                <Field label="Tags" name="tags" id="tags" component={Select} fullWidth dataOptions={this.state.allocationTo} disabled />
                <Field label="Allocation From" name="allocationFrom" id="allocationFrom" component={Select} fullWidth dataOptions={this.state.allocationFrom} disabled />
                <Field label="Allocation To" name="allocationTo" id="allocationTo" component={Select} fullWidth dataOptions={this.state.allocationTo} disabled />
              </Col>
            </Row>
            {
              isEditPage && (
              <IfPermission perm="finance-storage.funds.item.delete">
                { isBudgetData ? (
                  <Row>
                    <Col xs={12}>
                      <hr />
                      <ConnectionListing
                        title="Budget Connection"
                        isEmptyMessage="No items found"
                        items={budgetData}
                        path="/finance/fund/view/"
                        isView
                      />
                    </Col>
                  </Row>
                ) : (
                  <Row end="xs">
                    <Col xs={12}>
                      <Button type="button" onClick={() => { this.props.deleteFund(initialValues.id); }}>Remove</Button>
                    </Col>
                  </Row>
                )}
              </IfPermission>
              )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default FundForm;
