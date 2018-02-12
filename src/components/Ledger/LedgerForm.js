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
import Select from '@folio/stripes-components/lib/Select';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import Modal from '@folio/stripes-components/lib/Modal';
import stripes from "@folio/stripes-connect";
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';
// Components and Pages
import css from './LedgerForm.css';
import {FiscalYear} from '../FiscalYear';

class LedgerForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
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
      // Modal
      modalStatus: false,
      modalTitle: 'Fiscal Year Listing'
    }
    this.modalStatus = this.modalStatus.bind(this);

  }

  render() {
    return (
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
        </Col>
      </Row>
    )
  }

  modalStatus(e) {
    const modalStatus = this.state.modalStatus ? false : true;
    this.setState({ modalStatus });
  }
}

export default LedgerForm;
