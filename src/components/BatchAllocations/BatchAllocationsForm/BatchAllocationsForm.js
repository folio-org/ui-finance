import PropTypes from 'prop-types';
import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { FormSpy } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
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
import stripesFinalForm from '@folio/stripes/final-form';
import { useShowCallout } from '@folio/stripes-acq-components';

import { BUDGET_STATUSES } from '../../Budget/constants';
import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../constants';
import { BatchAllocationList } from './BatchAllocationList';
import {
  handleRecalculateError,
  normalizeFinanceFormData,
} from './utils';

const formatInvalidFundsListItem = (item, i) => <li key={i}>{item.fundName || item.fundId}</li>;

const formValuesSubscriber = (form) => ({ values }) => {
  form.batch(() => {
    values[BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData]?.forEach((item, index) => {
      const shouldSetActive = (
        !item.budgetId
        && item[BATCH_ALLOCATION_FIELDS.budgetAllocationChange] > 0
        && !item[BATCH_ALLOCATION_FIELDS.budgetStatus]
        && !item[BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure]
        && !item[BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance]
      );

      if (shouldSetActive) {
        form.change(`${BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData}[${index}].${BATCH_ALLOCATION_FIELDS.budgetStatus}`, BUDGET_STATUSES.ACTIVE);
      }
    });
  });
};

const BatchAllocationsForm = ({
  changeSorting,
  fiscalYear,
  form,
  handleSubmit,
  headline,
  initialValues,
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
  const [isRecalculateRequired, setIsRecalculateRequired] = useState(true);
  const previousFormValues = useRef({});

  const {
    invalid,
    pristine,
    submitting,
  } = form.getState();

  const isSubmitDisabled = (
    isSubmitDisabledProp
    || form.getState()?.values?.[BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.calculatedFinanceData] === null
    || isRecalculateRequired
    || invalid
    || pristine
    || submitting
  );

  useEffect(() => {
    const subscriber = formValuesSubscriber(form);
    const unsubscribe = form.subscribe(subscriber, { values: true });

    return () => {
      unsubscribe();
    };
  }, [form]);

  const showCallout = useShowCallout();

  const closeForm = useCallback(() => onCancel(), [onCancel]);

  const onSaveAndClose = useCallback((e) => {
    form.change(BATCH_ALLOCATION_FORM_SPECIAL_FIELDS._isRecalculating, false);
    handleSubmit(e);
  }, [form, handleSubmit]);

  const onRecalculate = useCallback(async () => {
    const {
      [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData]: fyFinanceData,
    } = form.getState().values;

    await recalculate({ fyFinanceData: normalizeFinanceFormData(fyFinanceData) })
      .then((res) => {
        form.change(BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.calculatedFinanceData, res.fyFinanceData);
      })
      .catch(async (error) => {
        await handleRecalculateError(error, showCallout);
      })
      .finally(() => {
        setIsRecalculateRequired(false);

        form.batch(() => {
          form.change(BATCH_ALLOCATION_FORM_SPECIAL_FIELDS._isRecalculating, true);
          form.submit();
        });
      });
  }, [form, recalculate, showCallout]);

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
          disabled={isSubmitDisabled}
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
    <form onSubmit={onSaveAndClose}>
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
          <Headline
            size="large"
            tag="h2"
            data-test-header-title
          >
            {headline}
          </Headline>

          <FormSpy
            subscription={{ values: true }}
            onChange={({ values }) => {
              const { fyFinanceData } = BATCH_ALLOCATION_FORM_SPECIAL_FIELDS;

              if (
                values
                && values[fyFinanceData] !== previousFormValues.current[fyFinanceData]
                && !isRecalculateRequired
              ) {
                previousFormValues.current = { ...values };

                setIsRecalculateRequired(true);
              }
            }}
          />

          <FieldArray
            id="batch-allocation-list"
            name={BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData}
            component={BatchAllocationList}
            props={{
              fiscalYear,
              onHeaderClick: changeSorting,
              sortDirection: sortingDirection,
              sortedColumn: sortingField,
            }}
          />

          {
            Boolean(initialValues[BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.invalidFunds]?.length) && (
              <Layout className="marginTop1">
                <MessageBanner type="error">
                  <FormattedMessage id="ui-finance.allocation.batch.form.validation.error.invalidFunds" />
                </MessageBanner>
                <Layout className="marginTopHalf">
                  <List
                    items={initialValues[BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.invalidFunds]}
                    itemFormatter={formatInvalidFundsListItem}
                    listStyle="bullets"
                  />
                </Layout>
              </Layout>
            )
          }
        </Pane>
      </Paneset>
    </form>
  );
};

BatchAllocationsForm.propTypes = {
  changeSorting: PropTypes.func.isRequired,
  fiscalYear: PropTypes.object,
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  headline: PropTypes.string,
  initialValues: PropTypes.object.isRequired,
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

export default stripesFinalForm({
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
})(BatchAllocationsForm);
