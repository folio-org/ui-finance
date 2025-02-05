import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';
import {
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  ConfirmationModal,
  exportToCsv,
  Loading,
  Selection,
} from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import {
  LIMIT_MAX,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { EXPORT_ALLOCATION_WORKSHEET_FIELDS } from '../../const';
import { useUpcomingFiscalYears } from '../../hooks';
import { fetchFinanceData } from '../../utils';

export const DownloadAllocationWorksheetModal = ({
  groupId,
  ledgerId,
  open,
  toggle,
}) => {
  const ky = useOkapiKy();
  const showCallout = useShowCallout();

  const [selectedFiscalYear, setSelectedFiscalYear] = useState();

  const {
    isFetching: isFiscalYearsFetching,
    fiscalYears,
  } = useUpcomingFiscalYears(
    { groupId, ledgerId },
    {
      enabled: open,
      onSuccess: (results) => setSelectedFiscalYear(results.fiscalYears[0]?.id),
    },
  );

  const dataOptions = useMemo(() => fiscalYears?.map(({ id, code }) => ({ label: code, value: id })), [fiscalYears]);

  const onConfirm = async () => {
    showCallout({ messageId: 'ui-finance.allocation.worksheet.download.start' });

    try {
      const fiscalYearsKV = keyBy(fiscalYears, 'id');
      const qIndex = groupId ? 'groupId' : 'ledgerId';
      const qValue = groupId ?? ledgerId;

      const { fyFinanceData } = await fetchFinanceData(ky)({
        searchParams: {
          query: `fiscalYearId=="${selectedFiscalYear}" and ${qIndex}=="${qValue}"`,
          limit: LIMIT_MAX,
        },
      });

      const exportData = fyFinanceData.map(({ fiscalYearId, ...rest }) => ({
        allocationAdjustment: 0,
        fiscalYearId,
        fiscalYear: fiscalYearsKV[fiscalYearId]?.code,
        ...rest,
      }));

      exportToCsv(
        [{ ...EXPORT_ALLOCATION_WORKSHEET_FIELDS }, ...exportData],
        {
          onlyFields: Object.keys(EXPORT_ALLOCATION_WORKSHEET_FIELDS),
          filename: [
            fiscalYearsKV[selectedFiscalYear]?.code,
            fyFinanceData[0]?.[groupId ? 'groupCode' : 'ledgerCode'],
          ].join(''),
          header: false,
        },
      );

      toggle();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      showCallout({
        messageId: 'ui-finance.allocation.worksheet.download.error',
        type: 'error',
      });
    }
  };

  const isConfirmButtonDisabled = !selectedFiscalYear || isFiscalYearsFetching;

  const message = (
    <Selection
      label={<><FormattedMessage id="ui-finance.fiscalyear" /> {isFiscalYearsFetching && <Loading />}</>}
      dataOptions={dataOptions}
      value={selectedFiscalYear}
      onChange={setSelectedFiscalYear}
      disabled={isFiscalYearsFetching}
    />
  );

  return (
    <ConfirmationModal
      open={open}
      onConfirm={onConfirm}
      onCancel={toggle}
      message={message}
      heading={<FormattedMessage id="ui-finance.selectFiscalYear" />}
      confirmLabel={<FormattedMessage id="stripes-core.button.confirm" />}
      isConfirmButtonDisabled={isConfirmButtonDisabled}
    />
  );
};

DownloadAllocationWorksheetModal.propTypes = {
  groupId: PropTypes.string,
  ledgerId: PropTypes.string,
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
