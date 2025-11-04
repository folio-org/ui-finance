import debounce from 'lodash/debounce';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import {
  startTransition,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Headline,
  Layout,
  List,
  MessageBanner,
  Pane,
  PaneFooter,
  Paneset,
  Row,
} from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';
import {
  EVENTS,
  FieldArray,
  useFormEngine,
  useFormState,
  useWatch,
} from '@folio/stripes-acq-components/experimental';

import { BUDGET_STATUSES } from '../../Budget/constants';
import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FLOW_TYPE,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../constants';
import { BatchAllocationList } from './BatchAllocationList';
import {
  handleRecalculateError,
  normalizeFinanceFormData,
} from './utils';

import css from './BatchAllocationsForm.css';

const {
  calculatedFinanceData: CALCULATED_FINANCE_DATA_FIELD,
  fyFinanceData: FY_FINANCE_DATA_FIELD,
  invalidFunds: INVALID_FUNDS_FIELD,
  recalculateErrors: RECALCULATE_ERRORS_FIELD,
  _isRecalculating: IS_RECALCULATING_FIELD,
} = BATCH_ALLOCATION_FORM_SPECIAL_FIELDS;

const formatInvalidFundsListItem = (item, i) => <li key={i}>{item.fundName || item.fundId}</li>;

/* Subscribe on form changes and set budget status */
const formValuesSubscriber = (form, fiscalYear, currentFiscalYears) => ({ values }) => {
  startTransition(() => {
    const currentFiscalYear = currentFiscalYears.find(({ series }) => series === fiscalYear.series);

    const updates = [];

    values[FY_FINANCE_DATA_FIELD]?.forEach((item, index) => {
      const shouldSetStatus = (
        !item.budgetId
        && item[BATCH_ALLOCATION_FIELDS.budgetAllocationChange] > 0
        && !item[BATCH_ALLOCATION_FIELDS.budgetStatus]
        && !item[BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure]
        && !item[BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance]
      );

      if (shouldSetStatus) {
        const status = new Date(fiscalYear?.periodStart) > new Date(currentFiscalYear?.periodStart)
          ? BUDGET_STATUSES.PLANNED
          : BUDGET_STATUSES.ACTIVE;

        updates.push({
          path: `${FY_FINANCE_DATA_FIELD}[${index}].${BATCH_ALLOCATION_FIELDS.budgetStatus}`,
          value: status,
        });
      }
    });

    if (updates.length > 0) {
      form.setMany(updates, { silent: true });
    }
  });
};

const BatchAllocationsForm = ({
  changeSorting,
  currentFiscalYears,
  fiscalYear,
  flowType,
  headline,
  initialValues,
  isLoading,
  isRecalculateDisabled,
  isSubmitDisabled: isSubmitDisabledProp,
  onCancel,
  paneSub,
  paneTitle,
  recalculate,
  recalculateOnInit = false,
  sortingField,
  sortingDirection,
}) => {
  const showCallout = useShowCallout();

  const [isSortingDisabled, setIsSortingDisabled] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isRecalculateRequired, setIsRecalculateRequired] = useState(true);
  const previousFormValues = useRef({});

  const engine = useFormEngine();
  const { values } = useFormState({ values: true });
  const { dirty } = useFormState({ dirty: true });
  const { submitting, valid } = useFormState({
    valid: true,
    submitting: true,
  });

  console.log('engine state', engine.getDebugInfo());
  console.log('isSortingDisabled', isSortingDisabled);

  const isSubmitDisabled = (
    isSubmitDisabledProp
    || get(values, CALCULATED_FINANCE_DATA_FIELD) === null
    // || isRecalculateRequired
    || !valid
    || (flowType === BATCH_ALLOCATION_FLOW_TYPE.CREATE && engine.getFieldState(FY_FINANCE_DATA_FIELD)?.pristine)
    || submitting
  );

  // console.group();
  // console.log('isRecalculating', isRecalculating);
  // console.log('isRecalculateRequired', isRecalculateRequired);
  // console.log('submitting', submitting);
  // console.log('valid', valid);
  // console.groupEnd();

  /* Subscribe on form changes */
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
    setIsSortingDisabled(dirty);
  }, [dirty]);

  /* Handle recalculate required */
  useEffect(() => {
    if (
      values
      && values[FY_FINANCE_DATA_FIELD] !== previousFormValues.current[FY_FINANCE_DATA_FIELD]
      && !isRecalculateRequired
    ) {
      previousFormValues.current = { ...values };

      setIsRecalculateRequired(true);
    }
  }, [values, isRecalculateRequired]);

  /* DEBUG */
  useEffect(() => {
    Object.values(EVENTS).forEach((event) => {
      engine.on(event, (...args) => console.log(event, args));
    });
  }, [engine]);

  const closeForm = useCallback(() => onCancel(), [onCancel]);

  const onRecalculate = useCallback(async () => {
    setIsRecalculating(true);

    const { [FY_FINANCE_DATA_FIELD]: fyFinanceData } = engine.getFormState().values;

    engine.set(RECALCULATE_ERRORS_FIELD, undefined, { silent: true });

    await recalculate({ fyFinanceData: normalizeFinanceFormData(fyFinanceData) })
      .then((res) => {
        engine.set(CALCULATED_FINANCE_DATA_FIELD, res.fyFinanceData);
      })
      .catch(async (error) => {
        engine.set(
          RECALCULATE_ERRORS_FIELD,
          await handleRecalculateError(error, showCallout),
          { silent: true },
        );
      })
      .finally(() => {
        setIsRecalculateRequired(false);

        engine.set(IS_RECALCULATING_FIELD, false, { silent: true });
        engine.submit();

        setIsRecalculating(false);
      });
  }, [engine, recalculate, showCallout]);

  useEffect(() => {
    if (recalculateOnInit) {
      onRecalculate();
    }
    /* onRecalculate should be triggered automatically only one time on form init */
  }, [recalculateOnInit]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = (
    <Row>
      <Col xs>
        <Button
          buttonStyle="default mega"
          onClick={closeForm}
        >
          <FormattedMessage id="stripes-acq-components.FormFooter.cancel" />
        </Button>
      </Col>
    </Row>
  );

  const end = (
    <Row>
      <Col xs>
        <Button
          buttonStyle="default mega"
          disabled={isRecalculateDisabled || submitting}
          onClick={onRecalculate}
        >
          <FormattedMessage id="ui-finance.allocation.batch.form.footer.recalculate" />
        </Button>
      </Col>
      <Col xs>
        <Button
          buttonStyle="primary mega"
          // disabled={isSubmitDisabled}
          type="submit"
        >
          <FormattedMessage id="stripes-components.saveAndClose" />
        </Button>
      </Col>
    </Row>
  );

  const paneFooter = (
    <PaneFooter
      renderStart={start}
      renderEnd={end}
    />
  );

  return (
    <Paneset isRoot>
      <Pane
        defaultWidth="fill"
        dismissible
        footer={paneFooter}
        id="batch-allocation-form"
        onClose={closeForm}
        paneTitle={paneTitle}
        paneSub={paneSub}
      >
        <div className={css['form-container']}>
          <Headline
            size="large"
            tag="h2"
            data-test-header-title
          >
            {headline}
          </Headline>

          <div className={css['form-content']}>
            <FieldArray
              id="batch-allocation-list"
              name={FY_FINANCE_DATA_FIELD}
            >
              {({ fields }) => (
                <BatchAllocationList
                  fields={fields}
                  props={{
                    fiscalYear,
                    isLoading: isLoading || isRecalculating,
                    onHeaderClick: isSortingDisabled ? noop : changeSorting,
                    sortDirection: sortingDirection,
                    sortedColumn: sortingField,
                  }}
                />
              )}
            </FieldArray>
          </div>

          {
            Boolean(initialValues[INVALID_FUNDS_FIELD]?.length) && (
              <Layout className="marginTop1">
                <MessageBanner type="error">
                  <FormattedMessage id="ui-finance.allocation.batch.form.validation.error.invalidFunds" />
                </MessageBanner>
                <Layout className="marginTopHalf">
                  <List
                    items={initialValues[INVALID_FUNDS_FIELD]}
                    itemFormatter={formatInvalidFundsListItem}
                    listStyle="bullets"
                  />
                </Layout>
              </Layout>
            )
          }
        </div>
      </Pane>
    </Paneset>
  );
};

BatchAllocationsForm.propTypes = {
  changeSorting: PropTypes.func.isRequired,
  currentFiscalYears: PropTypes.arrayOf(PropTypes.object),
  fiscalYear: PropTypes.object,
  flowType: PropTypes.string.isRequired,
  headline: PropTypes.string,
  initialValues: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  isRecalculateDisabled: PropTypes.bool,
  isSubmitDisabled: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  paneSub: PropTypes.string.isRequired,
  paneTitle: PropTypes.string.isRequired,
  recalculate: PropTypes.func.isRequired,
  recalculateOnInit: PropTypes.bool,
  sortingField: PropTypes.string.isRequired,
  sortingDirection: PropTypes.string.isRequired,
};

export default BatchAllocationsForm;
