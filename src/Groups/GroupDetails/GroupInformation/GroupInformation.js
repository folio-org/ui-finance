import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  KeyValue,
  Select,
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
  fiscalYears,
  allocated,
  unavailable,
  available,
  selectedFiscalYearId,
  setSelectedFY,
}) => {
  const fiscalYearsOptions = fiscalYears.map(fy => ({
    label: fy.code,
    value: fy.id,
  }));
  const selectFY = useCallback(({ target: { value } }) => {
    setSelectedFY(fiscalYears.find(fy => fy.id === value) || {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSelectedFY, selectedFiscalYearId]);

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
          <KeyValue label={<FormattedMessage id="ui-finance.groups.item.information.fiscalYear" />}>
            <Select
              dataOptions={fiscalYearsOptions}
              onChange={selectFY}
              value={selectedFiscalYearId}
            />
          </KeyValue>
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
          data-test-group-information-allocated={allocated}
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.groups.item.information.allocated" />}
          >
            <AmountWithCurrencyField
              amount={allocated}
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
              amount={unavailable}
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
              amount={available}
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
  fiscalYears: PropTypes.arrayOf(PropTypes.object),
  allocated: PropTypes.number,
  unavailable: PropTypes.number,
  available: PropTypes.number,
  selectedFiscalYearId: PropTypes.string.isRequired,
  setSelectedFY: PropTypes.func.isRequired,
};

GroupInformation.defaultProps = {
  description: '',
  acqUnitIds: [],
  allocated: 0,
  unavailable: 0,
  available: 0,
  fiscalYears: [],
};

export default GroupInformation;
