import PropTypes from 'prop-types';
import { useCallback } from 'react';

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
    if (values._isRecalculating) {
      form.change('_isRecalculating', false);

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
