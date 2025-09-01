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
  Loading,
  Select,
} from '@folio/stripes/components';

import {
  useLedgerCurrentFiscalYear,
  useLedgerPreviousFiscalYears,
} from '../../../common/hooks';

export const LedgerDetailsFiscalYear = ({
  fiscalYearOneId,
  ledgerId,
  onSelectFiscalYear,
  selectedFiscalYear,
}) => {
  const intl = useIntl();

  const {
    currentFiscalYear,
    isLoading: isCurrentFiscalYearLoading,
  } = useLedgerCurrentFiscalYear(ledgerId);

  const {
    fiscalYears,
    isLoading,
  } = useLedgerPreviousFiscalYears({
    fiscalYearOneId,
    ledgerId,
  });

  const dataOptions = useMemo(() => {
    return [
      currentFiscalYear && (
        <optgroup
          key={currentFiscalYear.id}
          label={intl.formatMessage({ id: 'ui-finance.groups.item.information.fiscalYear.current' })}
        >
          <option value={currentFiscalYear.id}>
            {currentFiscalYear.code}
          </option>
        </optgroup>
      ),
      fiscalYears?.length && (
        <optgroup
          key="previous-fiscal-years"
          label={intl.formatMessage({ id: 'ui-finance.groups.item.information.fiscalYear.previous' })}
        >
          {fiscalYears.map((year) => (
            <option
              key={year.id}
              value={year.id}
            >
              {year.code}
            </option>
          ))}
        </optgroup>
      ),
    ].filter(Boolean);
  }, [currentFiscalYear, fiscalYears, intl]);

  const onChange = useCallback(({ target: { value } }) => {
    onSelectFiscalYear(value);
  }, [onSelectFiscalYear]);

  if (isLoading || isCurrentFiscalYearLoading) return <Loading />;

  return (
    <Select
      label={<FormattedMessage id="ui-finance.fiscalyear" />}
      value={selectedFiscalYear}
      onChange={onChange}
    >
      {dataOptions}
    </Select>
  );
};

LedgerDetailsFiscalYear.propTypes = {
  fiscalYearOneId: PropTypes.string.isRequired,
  ledgerId: PropTypes.string.isRequired,
  onSelectFiscalYear: PropTypes.func.isRequired,
  selectedFiscalYear: PropTypes.string,
};
