import debounce from 'lodash/debounce';
import {
  startTransition,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  EVENTS,
  FIELD_EVENT_PREFIXES,
} from '@folio/stripes-acq-components/experimental';

import { BUDGET_STATUSES } from '../../Budget/constants';
import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../constants';
import { isBudgetStatusShouldBeSet } from './utils';

const { fyFinanceData: FY_FINANCE_DATA_FIELD } = BATCH_ALLOCATION_FORM_SPECIAL_FIELDS;

/* Subscribe on form changes and set budget status */
const formValuesSubscriber = (form, fiscalYear, currentFiscalYears) => ({ values }) => {
  startTransition(() => {
    const currentFiscalYear = currentFiscalYears.find(({ series }) => series === fiscalYear.series);

    const updates = [];
    const items = values[FY_FINANCE_DATA_FIELD] || [];

    for (const [index, item] of items.entries()) {
      const shouldSetStatus = isBudgetStatusShouldBeSet(item);

      if (shouldSetStatus) {
        const status = new Date(fiscalYear?.periodStart) > new Date(currentFiscalYear?.periodStart)
          ? BUDGET_STATUSES.PLANNED
          : BUDGET_STATUSES.ACTIVE;

        updates.push({
          path: `${FY_FINANCE_DATA_FIELD}[${index}].${BATCH_ALLOCATION_FIELDS.budgetStatus}`,
          value: status,
        });
      }
    }

    if (updates.length > 0) {
      form.setMany(updates);
    }
  });
};

export const useFormSubscriptions = (engine, {
  currentFiscalYears,
  fiscalYear,
  setIsNavigationCheckEnabled,
}) => {
  const [isFormSubmitting, setIsFormSubmitting] = useState(() => engine.getFormState().submitting);
  const [isFormValid, setIsFormValid] = useState(() => engine.getFormState().valid);
  const [isFinanceDataFieldDirty, setIsFinanceDataFieldDirty] = useState(() => {
    return engine.getFieldState(FY_FINANCE_DATA_FIELD)?.dirty;
  });
  const [isFinanceDataFieldPristine, setIsFinanceDataFieldPristine] = useState(() => {
    return engine.getFieldState(FY_FINANCE_DATA_FIELD)?.pristine;
  });
  const [isSortingDisabled, setIsSortingDisabled] = useState(false);
  const [isRecalculateRequired, setIsRecalculateRequired] = useState(true);

  /* Keep the latest value of isRecalculateRequired for the recalculate check */
  const isRecalculateRequiredRef = useRef(isRecalculateRequired);

  isRecalculateRequiredRef.current = isRecalculateRequired;

  // Synchronize state for the react
  useEffect(() => {
    const unsubscribeList = [
      engine.on(
        `${FIELD_EVENT_PREFIXES.CHANGE}${FY_FINANCE_DATA_FIELD}`,
        () => {
          const fieldState = engine.getFieldState(FY_FINANCE_DATA_FIELD);

          setIsFinanceDataFieldDirty(fieldState.dirty);
          setIsFinanceDataFieldPristine(fieldState.pristine);
        },
        null,
        { bubble: true },
      ),
      engine.on(
        EVENTS.SUBMITTING,
        ({ submitting }) => setIsFormSubmitting(submitting),
      ),
      engine.on(
        EVENTS.VALID,
        ({ valid }) => setIsFormValid(valid),
      ),
    ];

    return () => {
      unsubscribeList.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, [engine]);

  /*
    Usually navigation checks whole form dirty state,
    but in this case we need to trigger it only when finance data is changed,
    so we are checking it manually and enabling navigation check when finance data is dirty
  */
  useEffect(() => {
    setIsNavigationCheckEnabled(isFinanceDataFieldDirty);
  }, [isFinanceDataFieldDirty, setIsNavigationCheckEnabled]);

  /* Subscribe on form changes to set budget status */
  useEffect(() => {
    const subscriber = formValuesSubscriber(engine, fiscalYear, currentFiscalYears);
    const fn = debounce(() => subscriber({ values: engine.getFormState().values }), 200);
    const unsubscribe = engine.on(EVENTS.CHANGE, fn);

    return () => {
      unsubscribe();
    };
  }, [currentFiscalYears, engine, fiscalYear]);

  /* Set sorting disabled state */
  useEffect(() => {
    setIsSortingDisabled(isFinanceDataFieldDirty);
  }, [isFinanceDataFieldDirty, setIsSortingDisabled]);

  /* Handle recalculate required */
  useEffect(() => {
    const unsubscribe = engine.on(
      `${FIELD_EVENT_PREFIXES.CHANGE}${FY_FINANCE_DATA_FIELD}`,
      () => {
        if (!isRecalculateRequiredRef.current) {
          setIsRecalculateRequired(true);
        }
      },
      null,
      { bubble: true },
    );

    return () => {
      unsubscribe();
    };
  }, [engine]);

  return {
    isFinanceDataFieldDirty,
    isFinanceDataFieldPristine,
    isFormValid,
    isFormSubmitting,
    isRecalculateRequired,
    isSortingDisabled,
    setIsRecalculateRequired,
  };
};
