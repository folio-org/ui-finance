import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { Form, VALIDATION_MODES } from '@folio/stripes-acq-components/experimental';

import { BATCH_ALLOCATION_FORM_SPECIAL_FIELDS } from '../constants';
import { useBatchAllocationMutation } from '../hooks';
import BatchAllocationsForm from './BatchAllocationsForm';
import { normalizeFinanceFormData } from './utils';

export const BatchAllocationsFormContainer = ({
  initialValues,
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

    console.log('values', values);
    console.log('form', form);

    await new Promise(resolve => setTimeout(resolve, 6000));

    // onSubmitProp(
    //   {
    //     ...values,
    //     [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData]: normalizeFinanceFormData(
    //       values[BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData],
    //     ),
    //   },
    //   form,
    // );
  }, [onSubmitProp]);

  return (
    <Form
      defaultValidateOn={VALIDATION_MODES.SUBMIT}
      initialValues={initialValues}
      navigationCheck
      onSubmit={onSubmit}
      validate={({ recalculateErrors }) => recalculateErrors}
    >
      <BatchAllocationsForm
        initialValues={initialValues}
        isRecalculateDisabled={isRecalculateDisabled || isBatchAllocationMutationLoading}
        recalculate={recalculate}
        {...props}
      />
    </Form>
  );
};

BatchAllocationsFormContainer.propTypes = {
  isRecalculateDisabled: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};
