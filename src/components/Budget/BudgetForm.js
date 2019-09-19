import React, { Component } from 'react';
import { Field } from 'redux-form';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { IfPermission } from '@folio/stripes/core';
import { Button, Col, Row, Select, TextField } from '@folio/stripes/components';
// Components and Utils
import css from './css/BudgetForm.css';
import { Required } from '../../Utils/Validate';

class BudgetForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    deleteBudget: PropTypes.func,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { parentResources } = nextProps;

    if (parentResources || (parentResources.fund && parentResources.fiscalyear)) {
      const fundDD = parentResources.fund.records;

      if (!_.isEqual(prevState.fundDD, fundDD)) {
        return { fundDD };
      }
      const fiscalyearDD = parentResources.fiscalyear.records;

      if (!_.isEqual(prevState.fiscalyearDD, fiscalyearDD)) {
        return { fiscalyearDD };
      }
    }

    return false;
  }

  constructor(props) {
    super(props);
    this.state = {
      fundStatusDD: [
        { label: '-- Select --', value: '' },
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Frozen', value: 'Frozen' },
      ],
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    const { parentMutator } = this.props;

    parentMutator.queryCustom.update({
      fundQuery: 'query=(name="*")',
      fiscalyearQuery: 'query=(name="*")',
    });
  }

  componentWillUnmount() {
    const { parentMutator } = this.props;

    parentMutator.queryCustom.update({
      fundQuery: 'query=(name=null)',
      fiscalyearQuery: 'query=(name=null)',
      fundQueryID: 'query=(id=null)',
      fiscalyearQueryID: 'query=(id=null)',
    });
  }

  getData(resourceName) {
    const { parentResources } = this.props;
    const records = (parentResources[`${resourceName}`] || {}).records || [];

    if (!records || records.length === 0) return null;
    const newArr = [];
    let preObj = {};

    // Loop through records
    if (resourceName === 'fund') {
      preObj = { label: '-- Select a Fund --', value: '' };
    } else {
      preObj = { label: '-- Select a Fiscal Year --', value: '' };
    }
    newArr.push(preObj);

    Object.keys(records).map((key) => {
      const obj = {
        label: _.toString(records[key].name),
        value: _.toString(records[key].id),
      };

      newArr.push(obj);
      if (Number(key) === (records.length - 1)) {
        return newArr;
      }

      return newArr;
    });

    return newArr;
  }

  render() {
    const { initialValues } = this.props;
    const showDeleteButton = initialValues.id || false;
    const fundData = this.getData('fund');
    const fiscalyearData = this.getData('fiscalyear');

    return (
      <div style={{ margin: '0 auto', padding: '0' }} className={css.BudgetForm}>
        <Row>
          <Col xs={8} style={{ margin: '0 auto', padding: '0' }}>
            <Row>
              <Col xs={6}>
                <Field label="Name*" name="name" id="name" validate={[Required]} component={TextField} fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Budget Status*" name="budgetStatus" id="budgetStatus" validate={[Required]} component={Select} fullWidth dataOptions={this.state.fundStatusDD} />
              </Col>
              <Col xs={6}>
                <Field label="Code" name="code" id="code" component={TextField} fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Allowable Encumbrance Percent" name="limitEncPercent" id="allowable_enc_percent" component={TextField} type="number" fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Allowable Expenditure Percent" name="limitExpPercent" id="allowable_exp_percent" component={TextField} type="number" fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Allocation*" name="allocation" id="allocation" component={TextField} validate={[Required]} type="number" fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Awaiting Payment" name="awaitingPayment" id="awaitingPayment" component={TextField} type="number" fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Available" name="available" id="available" component={TextField} type="number" fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Encumbered" name="encumbered" id="encumbered" component={TextField} type="number" fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Expenditures" name="expenditures" id="expenditures" component={TextField} type="number" fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Over Encumbrance" name="overEncumbrance" id="overEncumbrance" component={TextField} type="number" fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Fund*" name="fundId" id="fundId" component={Select} fullWidth validate={[Required]} dataOptions={fundData} />
              </Col>
              <Col xs={6}>
                <Field label="Fiscal Year*" name="fiscalYearId" id="fiscalYearId" component={Select} validate={[Required]} fullWidth dataOptions={fiscalyearData} />
              </Col>
              <Col xs={6} style={{ display: 'none' }}>
                <Field label="Tags" name="tags" id="tags" component={Select} fullWidth dataOptions={this.state.allocationTo} disabled />
              </Col>
            </Row>
            <IfPermission perm="finance-storage.budgets.item.delete">
              <Row end="xs">
                <Col xs={12}>
                  {
                    showDeleteButton &&
                    <Button type="button" onClick={() => { this.props.deleteBudget(initialValues.id); }}>Remove</Button>
                  }
                </Col>
              </Row>
            </IfPermission>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BudgetForm;
