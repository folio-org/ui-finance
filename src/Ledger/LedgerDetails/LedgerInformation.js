import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  Row,
  Col,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { AcqUnitsView } from '@folio/stripes-acq-components';

const LedgerInformation = ({
  acqUnitIds,
  code,
  description,
  fiscalYearCode,
  metadata,
  name,
  status,
  restrictEncumbrance,
  restrictExpenditures,
}) => {
  return (
    <>
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
            value={fiscalYearCode}
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

        <Col xs={3}>
          <AcqUnitsView units={acqUnitIds} />
        </Col>

        <Col xs={3}>
          <Checkbox
            checked={restrictEncumbrance}
            disabled
            label={<FormattedMessage id="ui-finance.ledger.rollover.restrictEncumbrance" />}
            vertical
          />
        </Col>

        <Col xs={3}>
          <Checkbox
            checked={restrictExpenditures}
            disabled
            label={<FormattedMessage id="ui-finance.ledger.rollover.restrictExpenditures" />}
            vertical
          />
        </Col>

        <Col xs={9}>
          <KeyValue
            data-testid="description"
            label={<FormattedMessage id="ui-finance.ledger.description" />}
            value={description || <NoValue />}
          />
        </Col>
      </Row>
    </>
  );
};

LedgerInformation.propTypes = {
  metadata: PropTypes.object,
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  status: PropTypes.string,
  description: PropTypes.string,
  acqUnitIds: PropTypes.arrayOf(PropTypes.string),
  fiscalYearCode: PropTypes.string,
  restrictEncumbrance: PropTypes.bool.isRequired,
  restrictExpenditures: PropTypes.bool.isRequired,
};

export default LedgerInformation;
