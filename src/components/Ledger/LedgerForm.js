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
import { AccordionSet, Accordion} from '@folio/stripes-components/lib/Accordion';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import TextArea from '@folio/stripes-components/lib/TextArea';
import KeyValue from '@folio/stripes-components/lib/KeyValue';
import Select from '@folio/stripes-components/lib/Select';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import stripes from "@folio/stripes-connect";
import { Dropdown } from '@folio/stripes-components/lib/Dropdown';
import DropdownMenu from '@folio/stripes-components/lib/DropdownMenu';
import List from '@folio/stripes-components/lib/List';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import Badges from '@folio/stripes-components/lib/Badge/Badge.js'
// Components and Pages
import css from './css/LedgerForm.css';
import {FiscalYear} from '../FiscalYear';

class LedgerForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    deleteLedger: PropTypes.func,
    dropdownFiscalyears: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })),
    dropdownFiscalyears: PropTypes.arrayOf(PropTypes.object)
  }

  constructor(props) {
    super(props);
    this.state = {
      fiscalYearDD: false,
      currency_dd: [
        { label: "-- Select --", value: "" },
        { label: 'US Dollar', value: 'USD' }
      ],
      status_dd: [
        { label: "-- Select --", value: "" },
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Pending', value: 'Pending' },
      ],
    }

    this.checkFund = this.checkFund.bind(this);
    this.fundDataRender = this.fundDataRender.bind(this);
    this.onToggleAddFiscalYearDD = this.onToggleAddFiscalYearDD.bind(this);
  }

  componentWillMount() {
    const { initialValues, parentMutator } = this.props;
  }

  componentWillReceiveProps(nextProps) {
    const { initialValues, parentMutator, parentResources } = this.props;
    if (parentResources !== null) {
      // Funds
      if (parentResources.fund !== null) {
        if (!_.isEqual(nextProps.parentResources.fund.records, this.props.parentResources.fund.records)) {
          parentMutator.queryCustom.update({ fundQueryName: `query=(ledger_id="${initialValues.id}")`, fundCount: Math.floor(Math.random() + 2) + 30 });
        }
      }
      // Fiscla Year
      if (parentResources.fiscalyear !== null) {
        if (!_.isEqual(nextProps.parentResources.fiscalyear.records, this.props.parentResources.fiscalyear.records)) {
          parentMutator.queryCustom.update({ fundQueryName: `query=(ledger_id="${initialValues.id}")`, fundCount: Math.floor(Math.random() + 2) + 30 });
        }
      }
    }
  }

  render() {
    const { initialValues, dropdownFiscalyears } = this.props;
    const isEditPage = initialValues.id ? true : false;
    const showDeleteButton = this.props.checkFund !== null ? false : true;
    const itemFormatter = (item, i) => (this.fundDataRender(item, i)); 
    const isEmptyMessage = "No items found";
    const newFislcalYear = this.props.dropdownFiscalyears !== null ? true :  false;
    return (
      <div>
        <Row> 
          <Col xs={8} style={{ margin: "0 auto", padding: '0' }}>
            <Row>
              <Col xs={12} md={6}>
                <Col xs={12}>
                  <Field label="Name" name="name" id="name" component={TextField} fullWidth />
                </Col>
                <Col xs={12}>
                  <Field label="Code" name="code" id="code" component={TextField} fullWidth />
                </Col>
                <Col xs={12}>
                  <Field label="Currency" name="currency" id="currency" component={Select} fullWidth dataOptions={this.state.currency_dd} disabled />
                </Col>  
              </Col>
              <Col xs={12} md={6}>
                <Col xs={12}>
                  <Field label="Status" name="status" id="status" component={Select} fullWidth dataOptions={this.state.status_dd} disabled />
                </Col>  
                <Col xs={12}>
                  <Field label="Tags" name="tags" id="tags" component={TextField} fullWidth disabled />
                </Col>
                <Col xs={12}>
                  <Field label="Description" name="description" id="description" component={TextArea} fullWidth />
                </Col>
              </Col>
              <Col xs={12}>
                <hr />      
              </Col>   
              <Col xs={12} md={6}>
                <Col xs={12}>
                  <Field label="Allowable Encumbrance" name="allowable_encumbrance" id="allowable_encumbrance" component={TextField} fullWidth disabled />
                </Col>
                <Col xs={12}>
                  <Field label="Allowable Expenditure:" name="allowable_expenditure" id="allowable_expenditure" component={TextField} fullWidth disabled />
                </Col>
              </Col>
              <Col xs={12} md={6}>
                <Col xs={12} className={css.checkbox}>
                  <Field label="Freeze Activity" name='freeze_activity' id='freeze_activity' component={Checkbox} disabled />
                </Col>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <p>Fiscal Year Period</p>
              </Col>
              <Col xs={12} md={6} className={css.dateInputFix}>
                <Field label="Period Begin Date" name="period_start" id="period_start" component={Datepicker} />
              </Col>
              <Col xs={12} md={6} className={css.dateInputFix}>
                <Field label="Period End Date" name="period_end" id="period_end" component={Datepicker} />
              </Col>
              <Col xs={12}>
                <p>Fiscal Year Label</p>
              </Col>
              <Col xs={12}>
                {
                  newFislcalYear ? (
                    <Field multiple name="fiscal_years" name="fiscal_years" id="fiscal_years" component={Select} dataOptions={dropdownFiscalyears} style={{ height: '150px', width: '100%' }} />
                  ) : (
                      <p>"No fiscal year available"</p>
                    )
                }
              </Col>
            </Row>
            { isEditPage && (
            <IfPermission perm="ledger.item.delete">
              { showDeleteButton ? (
                <Row end="xs">
                  <Col xs={12}>
                    <Button type="button" onClick={() => { this.props.deleteLedger(initialValues.id) }}>Remove</Button>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col xs={12}>
                    {
                      fundData &&
                      (
                        <div className={css.list}>
                          <h4>Fund Connection</h4>
                          <span>This Ledger is connected to a Fund. Please removed the connection before deleting this ledger</span>
                          <List items={fundData} itemFormatter={itemFormatter} isEmptyMessage={isEmptyMessage} />
                        </div>
                      )
                    }
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

  checkFund = () => {
    const { parentResources } = this.props;
    const data = (parentResources.fund || {}).records || [];
    if (!data || data.length === 0) return null;
    return data;
  }

  fundDataRender(data, i) {
    return(<li key={i}>
      <a href={`/finance/fund/view/${data.id}`}>{data.name}</a>
    </li>
    );
  }

  onToggleAddFiscalYearDD() {
    if (this.state.fiscalYearDD === true) {
      this.setState({ fiscalYearDD: false });
    } else {
      this.setState({ fiscalYearDD: true });
    }
  }
}

export default LedgerForm;
