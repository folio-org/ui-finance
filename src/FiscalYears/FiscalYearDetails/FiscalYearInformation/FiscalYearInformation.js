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
  AcqUnitsView,
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
      </Row>
    </>
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
