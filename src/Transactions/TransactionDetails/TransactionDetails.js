import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ConfirmationModal,
  Pane,
  Row,
  Col,
  ExpandAllButton,
  AccordionSet,
  Accordion,
  AccordionStatus,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import {
  TRANSACTION_TYPES,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { ENCUMBRANCE_STATUS } from '../../common/const';
import {
  TRANSACTION_ACCORDION,
  TRANSACTION_ACCORDION_LABELS,
} from '../constants';
import TransactionInformation from './TransactionInformation';

const TransactionDetails = ({
  fiscalYearCode,
  fromFundName,
  fundId,
  onClose,
  toFundName,
  transaction,
  releaseTransaction,
}) => {
  const [isReleaseConfirmation, toggleReleaseConfirmation] = useModalToggle();
  const isEncumbrance = transaction.transactionType === TRANSACTION_TYPES.encumbrance;
  const isNotReleased = transaction.encumbrance?.status !== ENCUMBRANCE_STATUS.released;
  const onRelease = useCallback(() => {
    toggleReleaseConfirmation();
    releaseTransaction();
  }, [releaseTransaction, toggleReleaseConfirmation]);
  const releaseBtn = useMemo(
    () => (
      <IfPermission perm="ui-finance.manually-release-encumbrances">
        <Button
          buttonStyle="primary"
          marginBottom0
          onClick={toggleReleaseConfirmation}
        >
          <FormattedMessage id="ui-finance.transaction.releaseEncumbrance.button" />
        </Button>
      </IfPermission>
    ),
    [toggleReleaseConfirmation],
  );

  return (
    <Pane
      lastMenu={(isEncumbrance && isNotReleased) ? releaseBtn : undefined}
      id="pane-transaction-details"
      defaultWidth="fill"
      dismissible
      paneTitle={<FormattedMessage id={`ui-finance.transaction.type.${transaction.transactionType}`} />}
      onClose={onClose}
    >
      <AccordionStatus>
        <Row end="xs">
          <Col xs={12}>
            <ExpandAllButton />
          </Col>
        </Row>
        <AccordionSet>
          <Accordion
            id={TRANSACTION_ACCORDION.information}
            label={TRANSACTION_ACCORDION_LABELS[TRANSACTION_ACCORDION.information]}
          >
            <TransactionInformation
              fiscalYearCode={fiscalYearCode}
              fromFundName={fromFundName}
              fundId={fundId}
              toFundName={toFundName}
              transaction={transaction}
            />
          </Accordion>
        </AccordionSet>
      </AccordionStatus>

      {isReleaseConfirmation && (
        <ConfirmationModal
          id="release-confirmation"
          confirmLabel={<FormattedMessage id="ui-finance.transaction.releaseEncumbrance.confirm" />}
          heading={<FormattedMessage id="ui-finance.transaction.releaseEncumbrance.heading" />}
          message={<FormattedMessage id="ui-finance.transaction.releaseEncumbrance.message" />}
          onCancel={toggleReleaseConfirmation}
          onConfirm={onRelease}
          open
        />
      )}

    </Pane>
  );
};

TransactionDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  transaction: PropTypes.object.isRequired,
  fiscalYearCode: PropTypes.string.isRequired,
  toFundName: PropTypes.string,
  fromFundName: PropTypes.string,
  fundId: PropTypes.string.isRequired,
  releaseTransaction: PropTypes.func.isRequired,
};

export default TransactionDetails;
