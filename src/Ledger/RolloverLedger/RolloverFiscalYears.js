import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import {
  Button,
  Checkbox,
  Col,
  Headline,
  KeyValue,
  Layout,
  Row,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

import { FiscalYearField } from '../../common/FiscalYearField';

function RolloverFiscalYears({ currentFiscalYear, goToCreateFY }) {
  return (
    <>
      <Headline size="large" margin="medium" tag="h3">
        {currentFiscalYear?.code}
      </Headline>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-finance.ledger.rollover.periodBeginDate" />}
            value={<FolioFormattedDate value={currentFiscalYear?.periodStart} />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-finance.ledger.rollover.periodEndDate" />}
            value={<FolioFormattedDate value={currentFiscalYear?.periodEnd} />}
          />
        </Col>
        <Col xs={3}>
          {currentFiscalYear?.series && (
            <FiscalYearField
              name="toFiscalYearId"
              required
              series={currentFiscalYear.series}
            />
          )}
          <IfPermission perm="finance.fiscal-years.item.post">
            <Button
              buttonStyle="link"
              onClick={goToCreateFY}
            >
              <FormattedMessage id="ui-finance.ledger.createNewFY" />
            </Button>
          </IfPermission>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id="ui-finance.ledger.rollover.restrictEncumbrance" />}
            name="restrictEncumbrance"
            type="checkbox"
            validateFields={[]}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id="ui-finance.ledger.rollover.restrictExpenditures" />}
            name="restrictExpenditures"
            type="checkbox"
            validateFields={[]}
          />
        </Col>
        <Col xs={3}>
          <Layout className="padding-bottom-gutter">
            <Field
              component={Checkbox}
              label={<FormattedMessage id="ui-finance.ledger.rollover.closeAllCurrentBudgets" />}
              name="needCloseBudgets"
              type="checkbox"
              validateFields={[]}
            />
          </Layout>
        </Col>
      </Row>
    </>
  );
}

RolloverFiscalYears.propTypes = {
  currentFiscalYear: PropTypes.object,
  goToCreateFY: PropTypes.func.isRequired,
};

RolloverFiscalYears.defaultProps = {
};

export default RolloverFiscalYears;
