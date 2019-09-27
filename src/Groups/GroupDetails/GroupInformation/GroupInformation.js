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

const GroupInformation = ({
  metadata,
  name,
  code,
  status,
  description,
  acqUnitIds,
  fiscalYear,
}) => {
  return (
    <Fragment>
      {
        metadata && <ViewMetaData metadata={metadata} />
      }

      <Row>
        <Col
          data-test-group-information-name
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.groups.item.information.name" />}
            value={name}
          />
        </Col>

        <Col
          data-test-group-information-code
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.groups.item.information.code" />}
            value={code}
          />
        </Col>

        <Col
          data-test-group-information-fiscal-year
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.groups.item.information.fiscalYear" />}
            value={fiscalYear}
          />
        </Col>

        <Col
          data-test-group-information-status
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.groups.item.information.status" />}
          >
            <FormattedMessage id={`ui-finance.groups.status.${status.toLowerCase()}`} />
          </KeyValue>
        </Col>

        <Col
          data-test-group-information-allocated
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.groups.item.information.allocated" />}
          >
            <AmountWithCurrencyField
              amount={0}
            />
          </KeyValue>
        </Col>

        <Col
          data-test-group-information-unavailable
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.groups.item.information.unavailable" />}
          >
            <AmountWithCurrencyField
              amount={0}
            />
          </KeyValue>
        </Col>

        <Col
          data-test-group-information-available
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.groups.item.information.available" />}
          >
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
            label={<FormattedMessage id="ui-finance.groups.item.information.description" />}
            value={description}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

GroupInformation.propTypes = {
  metadata: PropTypes.object,
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  description: PropTypes.string,
  acqUnitIds: PropTypes.arrayOf(PropTypes.string),
  fiscalYear: PropTypes.string.isRequired,
};

GroupInformation.defaultProps = {
  description: '',
  acqUnitIds: [],
};

export default GroupInformation;
