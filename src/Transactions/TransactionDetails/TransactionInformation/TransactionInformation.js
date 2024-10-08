import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AmountWithCurrencyField,
  FolioFormattedTime,
} from '@folio/stripes-acq-components';

import { BracketizeTransactionAmount } from '../../BracketizeTransactionAmount';
import SourceValue from './SourceValue';
import ExpenseClassValue from './ExpenseClassValue';

const TransactionInformation = ({
  fiscalYearCode,
  fromFundName,
  fundId,
  toFundName,
  transaction,
}) => {
  const {
    currency,
    description = '',
    encumbrance,
    expenseClassId,
    metadata = {},
    tags,
    transactionType,
  } = transaction;

  return (
    <>
      <ViewMetaData metadata={metadata} />
      <Row>
        <Col
          data-test-transaction-information-date
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.date" />}
            value={<FolioFormattedTime dateString={metadata.createdDate} />}
          />
        </Col>

        <Col
          data-test-transaction-information-fiscal-year
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.fiscalYear" />}
            value={fiscalYearCode}
          />
        </Col>

        <Col
          data-test-transaction-information-amount
          xs={3}
        >
          <KeyValue label={<FormattedMessage id="ui-finance.transaction.amount" />}>
            <BracketizeTransactionAmount
              fundId={fundId}
              transaction={transaction}
              iconSize="small"
            />
          </KeyValue>
        </Col>

        <Col
          data-test-transaction-information-code
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.source" />}
            value={<SourceValue transaction={transaction} />}
          />
        </Col>

        <Col
          data-test-transaction-information-type
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.type" />}
            value={
              <FormattedMessage
                id={`ui-finance.transaction.type.${transactionType}`}
                defaultMessage={transactionType}
              />
            }
          />
        </Col>

        <Col
          data-test-transaction-information-from
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.from" />}
            value={fromFundName || <NoValue />}
          />
        </Col>

        <Col
          data-test-transaction-information-to
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.to" />}
            value={toFundName || <NoValue />}
          />
        </Col>

        <Col
          data-test-transaction-expense-class
          xs={3}
        >
          <ExpenseClassValue
            id={expenseClassId}
            label={<FormattedMessage id="ui-finance.transaction.expenseClass" />}
          />
        </Col>

        <Col
          data-test-transaction-information-tags
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.tags" />}
            value={tags?.tagList?.join(', ') || <NoValue />}
          />
        </Col>
      </Row>

      {encumbrance && (
        <Row>
          <Col
            data-test-transaction-amount-encumbered
            xs={3}
          >
            <KeyValue label={<FormattedMessage id="ui-finance.transaction.initialEncumbrance" />}>
              <AmountWithCurrencyField
                amount={encumbrance.initialAmountEncumbered}
                currency={currency}
                showBrackets={encumbrance.initialAmountEncumbered < 0}
              />
            </KeyValue>
          </Col>

          <Col
            data-test-transaction-amount-awaiting-payment
            xs={3}
          >
            <KeyValue label={<FormattedMessage id="ui-finance.transaction.amountAwaitingPayment" />}>
              <AmountWithCurrencyField
                amount={encumbrance.amountAwaitingPayment}
                currency={currency}
                showBrackets={encumbrance.amountAwaitingPayment < 0}
              />
            </KeyValue>
          </Col>

          <Col
            data-test-transaction-amount-expended
            xs={3}
          >
            <KeyValue label={<FormattedMessage id="ui-finance.transaction.expended" />}>
              <AmountWithCurrencyField
                amount={encumbrance.amountExpended}
                currency={currency}
                showBrackets={encumbrance.amountExpended < 0}
              />
            </KeyValue>
          </Col>

          <Col
            data-test-transaction-status
            xs={3}
          >
            <KeyValue label={<FormattedMessage id="ui-finance.transaction.status" />}>
              <span data-test-transaction-status-value>
                <FormattedMessage id={`ui-finance.transaction.status.${encumbrance.status}`} />
              </span>
            </KeyValue>
          </Col>
        </Row>
      )}

      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.description" />}
            value={description || <NoValue />}
          />
        </Col>
      </Row>
    </>
  );
};

TransactionInformation.propTypes = {
  fiscalYearCode: PropTypes.string.isRequired,
  fromFundName: PropTypes.string,
  fundId: PropTypes.string.isRequired,
  toFundName: PropTypes.string,
  transaction: PropTypes.object.isRequired,
};

export default TransactionInformation;
