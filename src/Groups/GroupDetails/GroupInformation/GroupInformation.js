import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  KeyValue,
  NoValue,
  Select,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { AcqUnitsView } from '@folio/stripes-acq-components';

const GroupInformation = ({
  metadata,
  name,
  code,
  status,
  description,
  acqUnitIds,
  fiscalYears,
  selectedFiscalYearId,
  onSelectFY,
}) => {
  const fiscalYearsOptions = fiscalYears.map(fy => ({
    label: fy.code,
    value: fy.id,
  }));
  const selectFY = useCallback(({ target: { value } }) => {
    onSelectFY(fiscalYears.find(fy => fy.id === value) || {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelectFY, selectedFiscalYearId]);

  return (
    <>
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

        <Col xs={3}>
          <AcqUnitsView units={acqUnitIds} />
        </Col>

        <Col xs={9}>
          <KeyValue
            data-testid="description"
            label={<FormattedMessage id="ui-finance.groups.item.information.description" />}
            value={description || <NoValue />}
          />
        </Col>
      </Row>
    </>
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
  selectedFiscalYearId: PropTypes.string.isRequired,
  onSelectFY: PropTypes.func.isRequired,
};

GroupInformation.defaultProps = {
  description: '',
  acqUnitIds: [],
  fiscalYears: [],
};

export default GroupInformation;
