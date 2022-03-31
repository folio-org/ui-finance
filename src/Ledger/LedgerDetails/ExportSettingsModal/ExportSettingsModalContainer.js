import PropTypes from 'prop-types';

import { EXPORT_EXPENSE_CLASSES_VALUES } from './constants';
import ExportSettingsModal from './ExportSettingsModal';

export const ExportSettingsModalContainer = ({
  fiscalYear,
  onCancel,
  toggleModal,
}) => {
  const initialValues = {
    fiscalYearId: fiscalYear.id,
    expenseClasses: EXPORT_EXPENSE_CLASSES_VALUES.all,
  };

  const onExportCSV = () => {
    toggleModal();
  };

  return (
    <ExportSettingsModal
      initialValues={initialValues}
      fiscalYear={fiscalYear}
      onCancel={onCancel}
      onSubmit={onExportCSV}
    />
  );
};

ExportSettingsModalContainer.propTypes = {
  fiscalYear: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};
