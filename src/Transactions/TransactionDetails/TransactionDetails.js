import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Row,
  Col,
  ExpandAllButton,
  AccordionSet,
  Accordion,
} from '@folio/stripes/components';
import {
  useAccordionToggle,
} from '@folio/stripes-acq-components';

import {
  TRANSACTION_ACCORDION,
  TRANSACTION_ACCORDION_LABELS,
} from '../constants';
import TransactionInformation from './TransactionInformation';

const TransactionDetails = ({
  fiscalYearCode,
  fromFundName,
  onClose,
  toFundName,
  transaction,
}) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();

  return (
    <Pane
      id="pane-transaction-details"
      defaultWidth="fill"
      dismissible
      paneTitle={<FormattedMessage id={`ui-finance.transaction.type.${transaction.transactionType}`} />}
      onClose={onClose}
    >
      <Row end="xs">
        <Col xs={12}>
          <ExpandAllButton
            accordionStatus={sections}
            onToggle={expandAll}
          />
        </Col>
      </Row>

      <AccordionSet
        accordionStatus={sections}
        onToggle={toggleSection}
      >
        <Accordion
          id={TRANSACTION_ACCORDION.information}
          label={TRANSACTION_ACCORDION_LABELS[TRANSACTION_ACCORDION.information]}
        >
          <TransactionInformation
            amount={transaction.amount}
            currency={transaction.currency}
            description={transaction.description}
            encumbrance={transaction.encumbrance}
            fiscalYearCode={fiscalYearCode}
            fiscalYearId={transaction.fiscalYearId}
            fromFundName={fromFundName}
            invoiceId={transaction.sourceInvoiceId}
            invoiceLineId={transaction.sourceInvoiceLineId}
            metadata={transaction.metadata}
            source={transaction.source}
            tags={transaction.tags}
            toFundName={toFundName}
            transactionType={transaction.transactionType}
          />
        </Accordion>
      </AccordionSet>

    </Pane>
  );
};

TransactionDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  transaction: PropTypes.object.isRequired,
  fiscalYearCode: PropTypes.string.isRequired,
  toFundName: PropTypes.string,
  fromFundName: PropTypes.string,
};

export default TransactionDetails;
