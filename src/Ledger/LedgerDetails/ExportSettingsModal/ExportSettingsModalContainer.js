import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useShowCallout } from '@folio/stripes-acq-components';

import { EXPORT_EXPENSE_CLASSES_VALUES } from './constants';
import { useLedgerExportCSV } from './hooks';
import ExportSettingsModal from './ExportSettingsModal';

export const ExportSettingsModalContainer = ({
  fiscalYear,
  ledger,
  onCancel,
}) => {
  const showCallout = useShowCallout();
  const {
    isLoading,
    runExportCSV,
  } = useLedgerExportCSV(ledger);

  const initialValues = {
    fiscalYearId: fiscalYear.id,
    expenseClasses: EXPORT_EXPENSE_CLASSES_VALUES.all,
  };

  const completeWithStatus = useCallback((status) => {
    showCallout({
      messageId: `ui-finance.exportCSV.exportSettings.export.${status}`,
      type: status,
      values: { name: ledger.name },
    });

    onCancel();
  }, [
    ledger,
    showCallout,
    onCancel,
  ]);

  const onExportCSV = useCallback((configs) => {
    showCallout({
      messageId: 'ui-finance.exportCSV.exportSettings.export.start',
      values: { name: ledger.name },
    });

    runExportCSV(configs, {
      onSuccess: () => completeWithStatus('success'),
      onError: () => completeWithStatus('error'),
    });
  }, [
    completeWithStatus,
    ledger,
    runExportCSV,
    showCallout,
  ]);

  return (
    <ExportSettingsModal
      fiscalYear={fiscalYear}
      initialValues={initialValues}
      isExporting={isLoading}
      onCancel={onCancel}
      onSubmit={onExportCSV}
    />
  );
};

ExportSettingsModalContainer.propTypes = {
  fiscalYear: PropTypes.object.isRequired,
  ledger: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
};
