import React, { useCallback } from 'react';
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

import RolloverLedgerBudgets from './RolloverLedgerBudgets';

export const ROLLOVER_LEDGER_ACCORDION = {
  budgets: 'budgets',
  encumbrances: 'encumbrances',
};

export const ROLLOVER_LEDGER_ACCORDION_LABELS = {
  [ROLLOVER_LEDGER_ACCORDION.budgets]: <FormattedMessage id="ui-finance.ledger.rollover.budgets" />,
  [ROLLOVER_LEDGER_ACCORDION.encumbrances]: <FormattedMessage id="ui-finance.ledger.rollover.encumbrances" />,
};

const RolloverLedger = ({
  goToCreateFY,
  handleSubmit,
  initialValues,
  ledger,
  onCancel,
  submitting,
  pristine,
}) => {
  const closeForm = useCallback(() => onCancel(), [onCancel]);

  const paneFooter = (
    <FormFooter
      label={<FormattedMessage id="ui-finance.ledger.rollover.saveBtn" />}
      handleSubmit={handleSubmit}
      submitting={submitting}
      onCancel={closeForm}
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
          onClose={closeForm}
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
              md={8}
              mdOffset={2}
            >
              <AccordionStatus>
                <AccordionSet>
                  <Accordion
                    id={ROLLOVER_LEDGER_ACCORDION.budgets}
                    label={ROLLOVER_LEDGER_ACCORDION_LABELS.budgets}
                  >
                    <RolloverLedgerBudgets />
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
  goToCreateFY: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  ledger: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
};

RolloverLedger.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  navigationCheck: true,
})(RolloverLedger);
