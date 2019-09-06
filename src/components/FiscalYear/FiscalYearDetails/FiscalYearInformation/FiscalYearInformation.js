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
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

const FiscalYearInformation = ({
  acqUnitIds,
  code,
  description,
  metadata,
  name,
  periodEnd,
  periodStart,
}) => {
  return (
    <Fragment>
      {metadata && <ViewMetaData metadata={metadata} />}
      <Row>
        <Col
          data-test-fiscal-year-name
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.fiscalYear.information.name" />}
            value={name}
          />
        </Col>

        <Col
          data-test-fiscal-year-code
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.fiscalYear.information.abbreviation" />}
            value={code}
          />
        </Col>

        <Col
          data-test-fiscal-year-start
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.fiscalYear.information.periodStart" />}
          >
            <FolioFormattedDate value={periodStart} />
          </KeyValue>
        </Col>

        <Col
          data-test-fiscal-year-end
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.fiscalYear.information.periodEnd" />}
          >
            <FolioFormattedDate value={periodEnd} />
          </KeyValue>
        </Col>

        <Col
          data-test-fiscal-year-allocated
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.fiscalYear.information.allocated" />}
          >
            <AmountWithCurrencyField />
          </KeyValue>
        </Col>

        <Col
          data-test-fiscal-year-unavailable
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.fiscalYear.information.unavailable" />}
          >
            <AmountWithCurrencyField />
          </KeyValue>
        </Col>

        <Col
          data-test-fiscal-year-available
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.fiscalYear.information.available" />}
          >
            <AmountWithCurrencyField />
          </KeyValue>
        </Col>

        <Col xs={3}>
          <AcqUnitsView units={acqUnitIds} />
        </Col>

        <Col
          data-test-fiscal-year-description
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.fiscalYear.information.description" />}
            value={description}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

FiscalYearInformation.propTypes = {
  acqUnitIds: PropTypes.arrayOf(PropTypes.string),
  code: PropTypes.string.isRequired,
  description: PropTypes.string,
  metadata: PropTypes.object,
  name: PropTypes.string.isRequired,
  periodEnd: PropTypes.string.isRequired,
  periodStart: PropTypes.string.isRequired,
};

FiscalYearInformation.defaultProps = {
  acqUnitIds: [],
  description: '',
};

export default FiscalYearInformation;
