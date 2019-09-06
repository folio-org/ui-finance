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
  AcqUnitsView,
  AmountWithCurrencyField,
} from '@folio/stripes-acq-components';

const LedgerInformation = ({ metadata, name, code, fiscalYear, status, description, acqUnitIds }) => {
  return (
    <Fragment>
      <ViewMetaData metadata={metadata} />
      <Row>
        <Col
          data-test-ledger-information-name
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.ledger.name" />}
            value={name}
          />
        </Col>

        <Col
          data-test-ledger-information-code
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.ledger.code" />}
            value={code}
          />
        </Col>

        <Col
          data-test-ledger-information-fiscal-year
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.ledger.currentFiscalYear" />}
            value={fiscalYear}
          />
        </Col>

        <Col
          data-test-ledger-information-status
          xs={3}
        >
          <KeyValue label={<FormattedMessage id="ui-finance.ledger.status" />}>
            {status && <FormattedMessage id={`ui-finance.ledger.status.${status.toLowerCase()}`} />}
          </KeyValue>
        </Col>

        <Col
          data-test-ledger-information-allocated
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.ledger.allocated" />}
          >
            <AmountWithCurrencyField
              amount={0}
            />
          </KeyValue>
        </Col>

        <Col
          data-test-ledger-information-unavailable
          xs={3}
        >
          <KeyValue label={<FormattedMessage id="ui-finance.ledger.unavailable" />}>
            <AmountWithCurrencyField
              amount={0}
            />
          </KeyValue>
        </Col>

        <Col
          data-test-ledger-information-available
          xs={3}
        >
          <KeyValue label={<FormattedMessage id="ui-finance.ledger.available" />}>
            <AmountWithCurrencyField
              amount={0}
            />
          </KeyValue>
        </Col>

        <Col xs={3}>
          <AcqUnitsView units={acqUnitIds} />
        </Col>

        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-finance.ledger.description" />}
            value={description}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

LedgerInformation.propTypes = {
  metadata: PropTypes.object,
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  status: PropTypes.string,
  description: PropTypes.string,
  acqUnitIds: PropTypes.arrayOf(PropTypes.string),
  fiscalYear: PropTypes.string.isRequired,
};

export default LedgerInformation;
