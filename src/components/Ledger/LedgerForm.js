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
    // dropdown_fiscalyears: PropTypes.array
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
  }

  render() {
    // const dropdown_fiscalyears = [{ label: "arvind", value: "f87ccffe-e77c-422c-b706-c8ac5238cd2e" }, { label: "aika", value: "7d28284c-5555-45c8-98b1-a9fd60910e3f" }];
    // const getFiscalYeaStatus = (this.props.parentResources || {}).fiscalYear.hasLoaded || false;
    const newRecords = this.props.dropdown_fiscalyears_array !== null ? true :  false;
    // this.setState({ newRecords });
    // console.log(typeof dropdown_fiscalyears);
    console.log(this.props);
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
                <h4>Fiscal Year Period</h4>
              </Col>
              <Col xs={12} md={6} className={css.dateInputFix}>
                <Field label="Period Begin Date" name="period_start" id="period_start" component={Datepicker} />
              </Col>
              <Col xs={12} md={6} className={css.dateInputFix}>
                <Field label="Period End Date" name="period_end" id="period_end" component={Datepicker} />
              </Col>
              <Col xs={12}>
                <h4>Fiscal Year Label</h4>
              </Col>
              <Col xs={12}>
                {
                  newRecords ? (
                    <Field multiple name="fiscal_years" name="fiscal_years" id="fiscal_years" component={Select} dataOptions={this.props.dropdown_fiscalyears_array} style={{ height: '150px', width: '100%' }} />
                  ) : (
                      <p>"No fiscal year available"</p>
                    )
                }
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
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
