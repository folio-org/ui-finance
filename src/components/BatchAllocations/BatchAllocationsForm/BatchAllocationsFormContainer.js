import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { BATCH_ALLOCATION_FORM_SPECIAL_FIELDS } from '../constants';
import { useBatchAllocationMutation } from '../hooks';
import BatchAllocationsForm from './BatchAllocationsForm';

export const BatchAllocationsFormContainer = ({
  onSubmit: onSubmitProp,
  ...props
}) => {
  const {
    recalculate,
    isLoading: isBatchAllocationMutationLoading,
  } = useBatchAllocationMutation();

  const onSubmit = useCallback(async (values, form) => {
    if (values[BATCH_ALLOCATION_FORM_SPECIAL_FIELDS._isRecalculating]) {
      form.change(BATCH_ALLOCATION_FORM_SPECIAL_FIELDS._isRecalculating, false);

      return;
    }

    onSubmitProp(values, form);
  }, [onSubmitProp]);

  return (
    <BatchAllocationsForm
      isRecalculateDisabled={isBatchAllocationMutationLoading}
      onSubmit={onSubmit}
      recalculate={recalculate}
      {...props}
    />
  );
};

BatchAllocationsFormContainer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
