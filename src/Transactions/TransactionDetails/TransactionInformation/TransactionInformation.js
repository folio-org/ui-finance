import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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

const TransactionInformation = ({
  amount,
  currency,
  description,
  fiscalYearCode,
  fromFundName,
  metadata,
  source,
  tags,
  toFundName,
  transactionType,
}) => {
  return (
    <Fragment>
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
            value={<FormattedMessage id={`ui-finance.transaction.source.${source}`} />}
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
            value={tags}
          />
        </Col>

        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-finance.transaction.description" />}
            value={description}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

TransactionInformation.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  description: PropTypes.string,
  fiscalYearCode: PropTypes.string.isRequired,
  fromFundName: PropTypes.string,
  metadata: PropTypes.object,
  source: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  toFundName: PropTypes.string,
  transactionType: PropTypes.string.isRequired,
};

TransactionInformation.defaultProps = {
  description: '',
  tags: [],
};

export default TransactionInformation;
