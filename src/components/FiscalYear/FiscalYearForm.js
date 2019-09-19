import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import {
  Col,
  Datepicker,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';

// Components and Utils
import css from './css/FiscalYearForm.css';
import { Required } from '../../Utils/Validate';
import ConnectionListing from '../ConnectionListing';

class FiscalYearForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    ledgerData: PropTypes.arrayOf(PropTypes.object),
    budgetData: PropTypes.arrayOf(PropTypes.object),
  }

  render() {
    const { initialValues, ledgerData, budgetData } = this.props;
    const isEditPage = initialValues.id || false;
    const isLedgerData = ledgerData !== null ? ledgerData : false;
    const isBudgetData = budgetData !== null ? budgetData : false;

    return (
      <div className={css.FiscalYearForm}>
        <Row>
          <Col xs={8} style={{ margin: '0 auto', padding: '0' }}>
            <Row>
              <Col xs={12} md={6}>
                <Field label="Name*" name="name" id="name" validate={[Required]} component={TextField} fullWidth />
              </Col>
              <Col xs={12} md={6}>
                <Field label="Abbreviation" name="code" id="code" component={TextField} fullWidth />
              </Col>
              <Col xs={12}>
                <Field label="Description" name="description" id="description" component={TextArea} fullWidth />
              </Col>
              <Col xs={12} md={6}>
                <Field label="Period Begin Date*" name="startDate" id="startDate" validate={[Required]} dateFormat="YYYY-MM-DD" timeZone="UTC" backendDateStandard="YYYY-MM-DD" component={Datepicker} />
              </Col>
              <Col xs={12} md={6}>
                <Field label="Period End Date*" name="endDate" id="endDate" validate={[Required]} dateFormat="YYYY-MM-DD" timeZone="UTC" backendDateStandard="YYYY-MM-DD" component={Datepicker} />
              </Col>
            </Row>

            {
              isEditPage && isLedgerData && (
                <Row>
                  <Col xs={12}>
                    <hr />
                    <ConnectionListing
                      title="Ledger Connection"
                      isEmptyMessage="No items found"
                      items={ledgerData}
                      path="/finance/ledger/view/"
                      isView
                    />
                  </Col>
                </Row>
              )
            }

            {
              isEditPage && isBudgetData && (
                <Row>
                  <Col xs={12}>
                    <hr />
                    <ConnectionListing
                      title="Budget Connection"
                      isEmptyMessage="No items found"
                      items={budgetData}
                      path="/finance/budget/view/"
                      isView
                    />
                  </Col>
                </Row>
              )
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default FiscalYearForm;
