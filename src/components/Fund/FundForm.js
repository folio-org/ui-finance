import React, { Component } from 'react';
import { Field } from 'redux-form';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Button from '@folio/stripes-components/lib/Button';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import TextArea from '@folio/stripes-components/lib/TextArea';
import Select from '@folio/stripes-components/lib/Select';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import css from './css/FundForm.css';
import { Required } from '../../Utils/Validate';
import ConnectionListing from '../ConnectionListing';

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
    this.state = {
      fundStatusDD: [
        { label: '-- Select --', value: '' },
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Frozen', value: 'Frozen' },
      ],
      currencyDD: [
        { label: '-- Select --', value: '' },
        { label: 'Canadian Dollar', value: 'CAD' },
        { label: 'U.S. Dollar', value: 'USD' },
      ]
    };
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
      budgetQuery: 'query=(fund_id=null)',
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
                <Field label="Name" name="name" id="name" validate={[Required]} component={TextField} fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Code" name="code" id="code" validate={[Required]} component={TextField} fullWidth />
              </Col>
              <Col xs={6} className={css.dateInputFix}>
                <Field label="Created Date" name="created_date" id="created_date" validate={[Required]} component={Datepicker} />
              </Col>
              <Col xs={6}>
                <Field label="Fund Status" name="fund_status" id="fund_status" component={Select} validate={[Required]} dataOptions={this.state.fundStatusDD} fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Currency" name="currency" id="currency" component={Select} dataOptions={this.state.currencyDD} validate={[Required]} fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Ledger" name="ledger_id" id="ledger" component={Select} validate={[Required]} dataOptions={this.getLedger()} fullWidth />
              </Col>
              <Col xs={12}>
                <Field label="Description" name="description" id="description" component={TextArea} fullWidth />
              </Col>
              <Col xs={6} style={{ display: 'none' }}>
                <Field label="Tags" name="tags" id="tags" component={Select} fullWidth dataOptions={this.state.allocation_to} disabled />
                <Field label="Allocation From" name="allocation_from" id="allocation_from" component={Select} fullWidth dataOptions={this.state.allocation_from} disabled />
                <Field label="Allocation To" name="allocation_to" id="allocation_to" component={Select} fullWidth dataOptions={this.state.allocation_to} disabled />
              </Col>
            </Row>
            {
              isEditPage && (
              <IfPermission perm="fund.item.delete">
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
