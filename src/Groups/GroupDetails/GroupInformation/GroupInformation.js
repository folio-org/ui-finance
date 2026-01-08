import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
  Select,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { AcqUnitsView } from '@folio/stripes-acq-components';

const DEFAULT_ACQUISITION_UNIT_IDS = [];
const DEFAULT_FISCAL_YEARS = [];

const GroupInformation = ({
  acqUnitIds = DEFAULT_ACQUISITION_UNIT_IDS,
  code,
  description = '',
  fiscalYears = DEFAULT_FISCAL_YEARS,
  metadata,
  name,
  onSelectFY,
  selectedFiscalYearId,
  status,
}) => {
  const intl = useIntl();

  const fiscalYearsOptions = useMemo(() => {
    return (
      Object.entries(fiscalYears).map(([aggregator, _fiscalYears]) => (
        !!_fiscalYears.length && (
          <optgroup
            key={aggregator}
            label={intl.formatMessage({ id: `ui-finance.groups.item.information.fiscalYear.${aggregator}` })}
          >
            {_fiscalYears.map(fy => (
              <option key={fy.id} value={fy.id}>{fy.code}</option>
            ))}
          </optgroup>
        )
      )).filter(Boolean)
    );
  }, [fiscalYears, intl]);

  const selectFY = useCallback(({ target: { value } }) => {
    const groupFiscalYears = Object.values(fiscalYears).flatMap(values => values);

    onSelectFY(groupFiscalYears.find(fy => fy.id === value) || {});
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
              onChange={selectFY}
              value={selectedFiscalYearId}
            >
              {fiscalYearsOptions}
            </Select>
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
  acqUnitIds: PropTypes.arrayOf(PropTypes.string),
  code: PropTypes.string.isRequired,
  description: PropTypes.string,
  fiscalYears: PropTypes.shape({
    current: PropTypes.arrayOf(PropTypes.object),
    previous: PropTypes.arrayOf(PropTypes.object),
  }),
  metadata: PropTypes.object,
  name: PropTypes.string.isRequired,
  onSelectFY: PropTypes.func.isRequired,
  selectedFiscalYearId: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default GroupInformation;
