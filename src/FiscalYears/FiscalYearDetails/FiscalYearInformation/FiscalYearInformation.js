import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  FormattedDate,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { AcqUnitsView } from '@folio/stripes-acq-components';

const renderUTCTime = value => (
  <FormattedDate
    value={value}
    year="numeric"
    month="numeric"
    day="numeric"
    hour="numeric"
    minute="numeric"
    timeZone="UTC"
  />
);

const DEFAULT_ACQ_UNIT_IDS = [];

const FiscalYearInformation = ({
  acqUnitIds = DEFAULT_ACQ_UNIT_IDS,
  code,
  currency,
  description = '',
  metadata,
  name,
  periodEnd,
  periodStart,
}) => {
  return (
    <>
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
            label={<FormattedMessage id="ui-finance.fiscalYear.information.code" />}
            value={code}
          />
        </Col>

        <Col
          data-test-fiscal-year-start
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.fiscalYear.information.periodStartUTC" />}
          >
            {renderUTCTime(periodStart)}
          </KeyValue>
        </Col>

        <Col
          data-test-fiscal-year-end
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.fiscalYear.information.periodEndUTC" />}
          >
            {renderUTCTime(periodEnd)}
          </KeyValue>
        </Col>

        <Col xs={3}>
          <AcqUnitsView units={acqUnitIds} />
        </Col>

        <Col
          data-test-fiscal-year-description
          xs={9}
        >
          <KeyValue
            data-testid="description"
            label={<FormattedMessage id="ui-finance.fiscalYear.information.description" />}
            value={description || <NoValue />}
          />
        </Col>

        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="stripes-acq-components.currency" />}
            value={currency || <NoValue />}
          />
        </Col>
      </Row>
    </>
  );
};

FiscalYearInformation.propTypes = {
  acqUnitIds: PropTypes.arrayOf(PropTypes.string),
  code: PropTypes.string.isRequired,
  currency: PropTypes.string,
  description: PropTypes.string,
  metadata: PropTypes.object,
  name: PropTypes.string.isRequired,
  periodEnd: PropTypes.string.isRequired,
  periodStart: PropTypes.string.isRequired,
};

export default FiscalYearInformation;
