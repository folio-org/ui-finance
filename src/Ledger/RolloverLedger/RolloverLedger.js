import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Col,
  Pane,
  Paneset,
  Row,
} from '@folio/stripes/components';
import {
  FormFooter,
} from '@folio/stripes-acq-components';

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
  fundTypesMap,
  goToCreateFY,
  handleSubmit,
  ledger,
  onCancel,
  pristine,
  submitting,
}) => {
  const paneFooter = (
    <FormFooter
      label={<FormattedMessage id="ui-finance.ledger.rollover.saveBtn" />}
      handleSubmit={handleSubmit}
      submitting={submitting}
      onCancel={onCancel}
      pristine={pristine}
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
