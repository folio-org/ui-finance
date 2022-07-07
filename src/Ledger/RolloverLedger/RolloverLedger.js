import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  Pane,
  PaneFooter,
  Paneset,
  Row,
} from '@folio/stripes/components';

import RolloverFiscalYears from './RolloverFiscalYears';
import RolloverLedgerBudgets from './RolloverLedgerBudgets';
import RolloverLedgerEncumbrances from './RolloverLedgerEncumbrances';

export const ROLLOVER_LEDGER_ACCORDION = {
  budgets: 'budgets',
  encumbrances: 'encumbrances',
};

export const ROLLOVER_LEDGER_ACCORDION_LABELS = {
  [ROLLOVER_LEDGER_ACCORDION.budgets]: <FormattedMessage id="ui-finance.ledger.rollover.budgets" />,
  [ROLLOVER_LEDGER_ACCORDION.encumbrances]: <FormattedMessage id="ui-finance.ledger.rollover.encumbrances" />,
};

const RolloverLedger = ({
  currentFiscalYear,
  fiscalYears,
  form: { change },
  fundTypesMap,
  goToCreateFY,
  handleSubmit,
  ledger,
  onCancel,
  pristine,
  submitting,
}) => {
  const testRolloverSubmit = useCallback(() => {
    change('isPreview', true);
    handleSubmit();
  }, [change, handleSubmit]);

  const start = (
    <Button
      buttonStyle="default mega"
      onClick={onCancel}
    >
      <FormattedMessage id="stripes-acq-components.FormFooter.cancel" />
    </Button>
  );

  const end = (
    <>
      <Button
        buttonStyle="default mega"
        disabled={pristine || submitting}
        onClick={testRolloverSubmit}
        type="submit"
      >
        <FormattedMessage id="ui-finance.ledger.rollover.testBtn" />
      </Button>
      <Button
        buttonStyle="primary mega"
        disabled={pristine || submitting}
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="ui-finance.ledger.rollover.saveBtn" />
      </Button>
    </>
  );

  const paneFooter = (
    <PaneFooter
      renderStart={start}
      renderEnd={end}
    />
  );

  return (
    <form>
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
          id="pane-ledger-rollover-form"
          onClose={onCancel}
          footer={paneFooter}
          paneTitle={(
            <FormattedMessage
              id="ui-finance.ledger.rollover.title"
              values={{ ledgerName: ledger.name }}
            />
          )}
        >
          <Row>
            <Col
              xs={12}
              md={10}
              mdOffset={1}
            >
              <RolloverFiscalYears
                currentFiscalYear={currentFiscalYear}
                fiscalYears={fiscalYears}
                goToCreateFY={goToCreateFY}
              />
              <AccordionStatus>
                <AccordionSet>
                  <Accordion
                    id={ROLLOVER_LEDGER_ACCORDION.budgets}
                    label={ROLLOVER_LEDGER_ACCORDION_LABELS.budgets}
                  >
                    <RolloverLedgerBudgets fundTypesMap={fundTypesMap} />
                  </Accordion>
                  <Accordion
                    id={ROLLOVER_LEDGER_ACCORDION.encumbrances}
                    label={ROLLOVER_LEDGER_ACCORDION_LABELS.encumbrances}
                  >
                    <RolloverLedgerEncumbrances />
                  </Accordion>
                </AccordionSet>
              </AccordionStatus>
            </Col>
          </Row>
        </Pane>
      </Paneset>
    </form>
  );
};

RolloverLedger.propTypes = {
  currentFiscalYear: PropTypes.object,
  fiscalYears: PropTypes.arrayOf(PropTypes.object),
  form: PropTypes.object.isRequired,
  fundTypesMap: PropTypes.object,
  goToCreateFY: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  ledger: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

RolloverLedger.defaultProps = {
  ledger: {},
};

export default stripesFinalForm({
  navigationCheck: true,
})(RolloverLedger);
