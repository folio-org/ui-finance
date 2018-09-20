import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import Button from '@folio/stripes-components/lib/Button';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import TextArea from '@folio/stripes-components/lib/TextArea';
import Datepicker from '@folio/stripes-components/lib/Datepicker';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
// Components and Utils
import css from './css/FiscalYearForm.css';
import { Required } from '../../Utils/Validate';
import ConnectionListing from '../ConnectionListing';

class FiscalYearForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    deleteFiscalYear: PropTypes.object,
    ledgerData: PropTypes.arrayOf(PropTypes.object),
    budgetData: PropTypes.arrayOf(PropTypes.object)
  }

  render() {
    const { initialValues, ledgerData, budgetData, deleteFiscalYear } = this.props;
    const isEditPage = initialValues.id || false;
    const isLedgerData = ledgerData !== null ? ledgerData : false;
    const isBudgetData = budgetData !== null ? budgetData : false;
    const isDataAvail = ledgerData || budgetData;

    return (
      <div className={css.FiscalYearForm}>
        <Row>
          <Col xs={8} style={{ margin: '0 auto', padding: '0' }}>
            <Row>
              <Col xs={12} md={6}>
                <Field label="Name*" name="name" id="name" validate={[Required]} component={TextField} fullWidth />
              </Col>
              <Col xs={12} md={6}>
                <Field label="Code" name="code" id="code" component={TextField} fullWidth />
              </Col>
              <Col xs={12}>
                <Field label="Description" name="description" id="description" component={TextArea} fullWidth />
              </Col>
              <Col xs={12} md={6}>
                <Field label="Period Begin Date*" name="period_start" id="period_start" validate={[Required]} dateFormat="YYYY-MM-DD" timeZone="UTC" backendDateStandard="YYYY-MM-DD" component={Datepicker} />
              </Col>
              <Col xs={12} md={6}>
                <Field label="Period End Date*" name="period_end" id="period_end" validate={[Required]} dateFormat="YYYY-MM-DD" timeZone="UTC" backendDateStandard="YYYY-MM-DD" component={Datepicker} />
              </Col>
            </Row>
            {
              isEditPage && (
              <IfPermission perm="fiscal_ year.item.delete">
                { isDataAvail ? (
                  <Row>
                    {
                      isLedgerData &&
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
                    }
                    {
                      isBudgetData &&
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
                    }
                  </Row>
                ) : (
                  <Row end="xs">
                    <Col xs={12}>
                      <Button type="button" onClick={() => { deleteFiscalYear(initialValues.id); }}>Remove</Button>
                    </Col>
                  </Row>
                )}
              </IfPermission>
              )
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default FiscalYearForm;
