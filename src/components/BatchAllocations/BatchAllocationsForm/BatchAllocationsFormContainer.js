import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { BATCH_ALLOCATION_FORM_SPECIAL_FIELDS } from '../constants';
import { useBatchAllocationMutation } from '../hooks';
import BatchAllocationsForm from './BatchAllocationsForm';
import { normalizeFinanceFormData } from './utils';

export const BatchAllocationsFormContainer = ({
  isRecalculateDisabled,
  onSubmit: onSubmitProp,
  ...props
}) => {
  const {
    recalculate,
    isLoading: isBatchAllocationMutationLoading,
  } = useBatchAllocationMutation();

  const onSubmit = useCallback(async (values, form) => {
    if (values[BATCH_ALLOCATION_FORM_SPECIAL_FIELDS._isRecalculating]) return;

    onSubmitProp(
      {
        ...values,
        [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData]: normalizeFinanceFormData(
          values[BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData],
        ),
      },
      form,
    );
  }, [onSubmitProp]);

  return (
    <BatchAllocationsForm
      isRecalculateDisabled={isRecalculateDisabled || isBatchAllocationMutationLoading}
      onSubmit={onSubmit}
      recalculate={recalculate}
      {...props}
    />
  );
};

BatchAllocationsFormContainer.propTypes = {
  isRecalculateDisabled: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};
