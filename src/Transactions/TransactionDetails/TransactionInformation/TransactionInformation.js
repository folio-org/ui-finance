import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Row,
  Col,
  KeyValue,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  AmountWithCurrencyField,
  FolioFormattedTime,
} from '@folio/stripes-acq-components';

import { getSourceLink } from './utils';

const TransactionInformation = ({
  amount,
  currency,
  description,
  encumbrance,
  fiscalYearCode,
  fiscalYearId,
  fromFundName,
  invoiceId,
  invoiceLineId,
  metadata,
  source,
  tags,
  toFundName,
  transactionType,
}) => {
  const sourceLink = useMemo(
    () => getSourceLink(source, fiscalYearId, invoiceId, invoiceLineId, encumbrance?.sourcePoLineId),
    [source, fiscalYearId, invoiceId, invoiceLineId, encumbrance],
  );
  const sourceValue = sourceLink
    ? (
      <Link
        data-testid="transaction-source-link"
        to={sourceLink}
      >
        <FormattedMessage id={`ui-finance.transaction.source.${source}`} />
      </Link>
    )
    : <FormattedMessage id={`ui-finance.transaction.source.${source}`} />;

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
            <AmountWithCurrencyField
              amount={amount}
              currency={currency}
            />
          </KeyValue>
        </Col>

        <Col
          data-test-transaction-information-code
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.source" />}
            value={sourceValue}
          />
        </Col>

        <Col
          data-test-transaction-information-type
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.type" />}
            value={transactionType}
          />
        </Col>

        <Col
          data-test-transaction-information-from
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.from" />}
            value={fromFundName}
          />
        </Col>

        <Col
          data-test-transaction-information-to
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.to" />}
            value={toFundName}
          />
        </Col>

        <Col
          data-test-transaction-information-tags
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.tags" />}
            value={tags.tagList.join(', ')}
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
            value={description}
          />
        </Col>
      </Row>
    </>
  );
};

TransactionInformation.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  description: PropTypes.string,
  encumbrance: PropTypes.object,
  fiscalYearCode: PropTypes.string.isRequired,
  fiscalYearId: PropTypes.string,
  fromFundName: PropTypes.string,
  invoiceId: PropTypes.string,
  invoiceLineId: PropTypes.string,
  metadata: PropTypes.object,
  source: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.object),
  toFundName: PropTypes.string,
  transactionType: PropTypes.string.isRequired,
};

TransactionInformation.defaultProps = {
  description: '',
  metadata: {},
  tags: { tagList: [] },
};

export default TransactionInformation;
