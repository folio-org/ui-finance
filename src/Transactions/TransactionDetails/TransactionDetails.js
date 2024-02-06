import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

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
  PaneHeader,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import {
  ORDER_STATUSES,
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
  order,
  toFundName,
  transaction,
  releaseTransaction,
  unreleaseTransaction,
}) => {
  const intl = useIntl();
  const [isReleaseConfirmation, toggleReleaseConfirmation] = useModalToggle();
  const [isUnreleaseConfirmation, toggleIsUnreleaseConfirmation] = useModalToggle();

  const isEncumbrance = transaction.transactionType === TRANSACTION_TYPES.encumbrance;
  const isNotReleased = transaction.encumbrance?.status !== ENCUMBRANCE_STATUS.released;

  const onRelease = useCallback(() => {
    toggleReleaseConfirmation();
    releaseTransaction();
  }, [releaseTransaction, toggleReleaseConfirmation]);

  const onUnrelease = useCallback(() => {
    toggleIsUnreleaseConfirmation();
    unreleaseTransaction();
  }, [unreleaseTransaction, toggleIsUnreleaseConfirmation]);

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

  const unreleaseBtn = (
    <IfPermission perm="ui-finance.encumbrance.unrelease">
      <Button
        buttonStyle="primary"
        onClick={toggleIsUnreleaseConfirmation}
        marginBottom0
      >
        <FormattedMessage id="ui-finance.transaction.unreleaseEncumbrance.button" />
      </Button>
    </IfPermission>
  );

  const getPaneHeaderLastMenu = () => {
    if (isEncumbrance) {
      if (isNotReleased) return releaseBtn;

      const isOpenOrderReleasedEncumbrance = order?.workflowStatus === ORDER_STATUSES.open;

      return isOpenOrderReleasedEncumbrance
        ? unreleaseBtn
        : undefined;
    }

    return undefined;
  };

  const renderHeader = (paneHeaderProps) => (
    <PaneHeader
      {...paneHeaderProps}
      dismissible
      lastMenu={getPaneHeaderLastMenu()}
      paneTitle={<FormattedMessage id={`ui-finance.transaction.type.${transaction.transactionType}`} />}
      onClose={onClose}
    />
  );

  return (
    <Pane
      id="pane-transaction-details"
      defaultWidth="fill"
      renderHeader={renderHeader}
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
          heading={intl.formatMessage({ id: 'ui-finance.transaction.releaseEncumbrance.heading' })}
          message={<FormattedMessage id="ui-finance.transaction.releaseEncumbrance.message" />}
          onCancel={toggleReleaseConfirmation}
          onConfirm={onRelease}
          open
        />
      )}

      <ConfirmationModal
        open={isUnreleaseConfirmation}
        id="unrelease-confirmation"
        confirmLabel={<FormattedMessage id="ui-finance.transaction.button.confirm" />}
        heading={intl.formatMessage({ id: 'ui-finance.transaction.unreleaseEncumbrance.heading' })}
        message={<FormattedMessage id="ui-finance.transaction.unreleaseEncumbrance.message" />}
        onCancel={toggleIsUnreleaseConfirmation}
        onConfirm={onUnrelease}
      />
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
  order: PropTypes.object,
  releaseTransaction: PropTypes.func.isRequired,
  unreleaseTransaction: PropTypes.func.isRequired,
};

export default TransactionDetails;
