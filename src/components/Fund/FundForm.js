import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Button from '@folio/stripes-components/lib/Button';
import Icon from '@folio/stripes-components/lib/Icon';
import stripesForm from '@folio/stripes-form';
import { ExpandAllButton } from '@folio/stripes-components/lib/Accordion';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import TextArea from '@folio/stripes-components/lib/TextArea';
import Select from '@folio/stripes-components/lib/Select';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import List from '@folio/stripes-components/lib/List';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import Badges from '@folio/stripes-components/lib/Badge/Badge.js'
// Components and Utils
import css from './css/FundForm.css';
import { Required } from '../../Utils/Validate';
import ConnectionListing from '../ConnectionListing';

class FundForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    deleteFund: PropTypes.func,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      fund_status_dd: [
        { label: "-- Select --", value: "" },
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Pending', value: 'Pending' },
      ],
      currency_dd: [
        { label: "-- Select --", value: "" },
        { label: 'Canadian Dollar', value: 'CAD' },
        { label: 'U.S. Dollar', value: 'USD' },
      ],
      ledger_dd: []
    }
    this.getLedger = this.getLedger.bind(this);
  }

  componentWillMount() {
    const { initialValues, parentMutator } = this.props;
    if (initialValues.id) {
      parentMutator.budgetQuery.update({ fundID: `query=(fund_id="${initialValues.id}")`, fundCount: Math.floor(Math.random()+1)+30 });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { initialValues, parentMutator, parentResources } = this.props;
    if (parentResources !== null) {
      if (parentResources.budget !== null) {
        if (!_.isEqual(nextProps.parentResources.budget.records, this.props.parentResources.budget.records)) {
          parentMutator.budgetQuery.update({ fundID: `query=(fund_id="${initialValues.id}")`, fundCount: Math.floor(Math.random() + 2) + 30 });
        }
      }
    }
  }

  render() {
    const { initialValues } = this.props;
    const isEditPage = initialValues.id ? true : false;
    const showDeleteButton = this.props.checkBudget !== null ? false : true;
    
    return (
      <div style={{ margin: "0 auto", padding: '0' }} className={css.FundForm}>
        <Row>
          <Col xs={8} style={{ margin: "0 auto", padding: '0' }}>
            <Row>
              <Col xs={6}>
                <Field label="Name" name="name" id="name" validate={[Required]} component={TextField} fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Code" name="code" id="code" validate={[Required]} component={TextField} fullWidth />
              </Col>
              <Col xs={6}>
                <Field label="Description" name="description" id="description" component={TextArea} fullWidth />
              </Col>
              <Col xs={6} className={css.dateInputFix}>
                <Field label="Created Date" name="created_date" id="created_date" component={Datepicker} />
              </Col>
              <Col xs={6}>
                <Field label="Fund Status" name="fund_status" id="fund_status" component={Select} fullWidth dataOptions={this.state.fund_status_dd} />
              </Col>
              <Col xs={6}>
                <Field label="Currency" name="currency" id="currency" component={Select} fullWidth dataOptions={this.state.currency_dd} />
              </Col>
              <Col xs={6}>
                <Field label="Ledger" name="ledger_id" id="ledger" component={Select} fullWidth dataOptions={this.getLedger()} />
              </Col>
              <Col xs={6}>
                <Field label="Tags" name="tags" id="tags" component={Select} fullWidth dataOptions={this.state.allocation_to} disabled />
              </Col>
              <Col xs={6}>
                <Field label="Allocation From" name="allocation_from" id="allocation_from" component={Select} fullWidth dataOptions={this.state.allocation_from} disabled />
              </Col>
              <Col xs={6}>
                <Field label="Allocation To" name="allocation_to" id="allocation_to" component={Select} fullWidth dataOptions={this.state.allocation_to} disabled />
              </Col>
            </Row>
            { isEditPage && (
            <IfPermission perm="fund.item.delete">
              { showDeleteButton ? (
                <Row end="xs">
                  <Col xs={12}>
                    <Button type="button" onClick={() => { this.props.deleteFund(initialValues.id) }}>Remove</Button>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col xs={12}>
                    <hr />
                    <ConnectionListing
                      title={'Budget Connection'}
                      isEmptyMessage={'"No items found"'}
                      items={this.props.budgetData}
                      isView={false}
                      path={'/finance/fund/view/'}
                    />
                  </Col>
                </Row>
              )}
             </IfPermission>
            )}
          </Col>
        </Row>
      </div>
    ) 
  }

  getLedger() {
    const { parentResources } = this.props;
    const ledgers = (parentResources.ledger || {}).records || [];
    if (!ledgers || ledgers.length === 0) return null;
    let newArr = [];
    Object.keys(ledgers).map((key) => {
      let obj = {
        label: ledgers[key].name,
        value: _.toString(ledgers[key].id)
      };
      newArr.push(obj);
      if (Number(key) === ledgers.length) {
        return newArr;
      }
    });
    return newArr;
  }

  budgetDataRender(data, i) {
    return(<li key={i}>
      <a href={`/finance/budget/view/${data.id}`}>{data.name}</a>
    </li>
    );
  }
}

export default FundForm;