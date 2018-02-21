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
// Components and Pages
import css from './css/LedgerForm.css';
import {FiscalYear} from '../FiscalYear';

class LedgerForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
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

    this.onToggleAddFiscalYearDD = this.onToggleAddFiscalYearDD.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderForms = this.renderForms.bind(this);
    this.renderSubForm = this.renderSubForm.bind(this);
    this.renderField = this.renderField.bind(this);
  }

  render() {
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
                  <Field label="Currency" name="currency" id="currency" component={Select} fullWidth dataOptions={this.state.currency_dd} />
                </Col>  
              </Col>
              <Col xs={12} md={6}>
                <Col xs={12}>
                  <Field label="Status" name="status" id="status" component={Select} fullWidth dataOptions={this.state.status_dd} />
                </Col>  
                <Col xs={12}>
                  <Field label="Tags" name="tags" id="tags" component={TextField} fullWidth />
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
                  <Field label="Allowable Encumbrance" name="allowable_encumbrance" id="allowable_encumbrance" component={TextField} fullWidth />
                </Col>
                <Col xs={12}>
                  <Field label="Allowable Expenditure:" name="allowable_expenditure" id="allowable_expenditure" component={TextField} fullWidth />
                </Col>
              </Col>
              <Col xs={12} md={6}>
                <Row>
                  <Col xs={12} md={6} className={css.dateInputFix}>
                    <Field label="Period Begin Date" name="period_start" id="period_start" component={Datepicker} />
                  </Col>
                  <Col xs={12} md={6} className={css.dateInputFix}>
                    <Field label="Period End Date" name="period_end" id="period_end" component={Datepicker} />
                  </Col>
                </Row>
                <Col xs={12} className={css.checkbox}>
                  <Field label="Freeze Activity" name='freeze_activity' id='freeze_activity' component={Checkbox} />
                </Col>
              </Col>
            </Row>
            <Col xs={12}>
              <h4>Fiscal Year</h4>
              <Dropdown id="AddFiscalYearDropdown" open={this.state.fiscalYearDD} onToggle={this.onToggleAddFiscalYearDD} group style={{ float: 'right' }} pullRight>
                <Button data-role="toggle" align="end" aria-haspopup="true" >
                  &#43; Add Permission
                </Button>
                <DropdownMenu data-role="menu" aria-label="available fiscal year" onToggle={this.onToggleAddFiscalYearDD}>
                  <FieldArray label="Fiscal Year" name="fiscal_year" id="fiscal_year" component={this.renderList} />
                </DropdownMenu>
              </Dropdown>
            </Col>
            <Col xs={12}>
              <FieldArray label="Fiscal Year" name="fiscal_year" id="fiscal_year" component={this.renderForms} />
            </Col>
          </Col>
        </Row>
      </div>
    )
  }

  onToggleAddFiscalYearDD() {
    console.log(this.state.fiscalYearDD);
    if (this.state.fiscalYearDD === true) {
      this.setState({ fiscalYearDD: false });
    } else {
      this.setState({ fiscalYearDD: true });
    }
  }

  renderList = ({ fields }) => {
    const props = this.props;
    const records = (props.parentResources || {}).fiscalYear.records || [];
    const itemFormatter = (item, index) => (
      <li key={index}><a href="javascript:void(0)" onClick={() => {
        fields.push({ ...item });
      }}>{item.name}</a></li>
    );
    const isEmptyMessage = 'No items to show';
      return (
      <List
        items={records}
        itemFormatter={itemFormatter}
        isEmptyMessage={isEmptyMessage}
      />
    )
  }

  renderForms = ({ fields }) => {
    return (
      <Row>
        <Col xs={12}>
          {fields.map(this.renderSubForm)}
        </Col>
      </Row>
    )
  }

  // <Col xs={12} md={4}>
  //   <Field label="name" className={css.readonlyInput} name={`${elem}.name`} id={`${elem}.name`} component={TextField} disabled readonly fullWidth />
  // </Col>
  // <Col xs={12} md={4}>
  //   <Field label="description" className={css.readonlyInput} name={`${elem}.description`} id={`${elem}.description`} component={TextField} disabled readonly fullWidth />
  // </Col>
  // <Col xs={12} md={4}>
  // <Field label="Code" className={css.readonlyInput} name={`${elem}.code`} id={`${elem}.code`} component={TextField} disabled readonly fullWidth />
  // </Col>

  renderSubForm = (elem, index, fields) => {
    return (
      <Row key={index}>
        <Col xs={12} md={2}>
          <Button onClick={() => fields.remove(index)} buttonStyle="error" style={{ width: '100%', marginTop: '18px' }}>
            Remove
          </Button>
        </Col>
      </Row>
    );
  }
}

export default LedgerForm;
