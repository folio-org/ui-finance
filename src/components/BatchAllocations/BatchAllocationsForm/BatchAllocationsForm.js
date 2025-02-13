import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
} from 'react';
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
import { BATCH_ALLOCATION_FIELDS } from '../constants';
import { BatchAllocationList } from './BatchAllocationList';

const formatInvalidFundsListItem = (item, i) => <li key={i}>{item.fundName || item.fundId}</li>;

const formValuesSubscriber = (form) => ({ values }) => {
  form.batch(() => {
    values.fyFinanceData?.forEach((item, index) => {
      const shouldSetActive = (
        !item.budgetId
        && item[BATCH_ALLOCATION_FIELDS.budgetAllocationChange] > 0
        && !item[BATCH_ALLOCATION_FIELDS.budgetStatus]
        && !item[BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure]
        && !item[BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance]
      );

      if (shouldSetActive) {
        form.change(`fyFinanceData[${index}].${BATCH_ALLOCATION_FIELDS.budgetStatus}`, BUDGET_STATUSES.ACTIVE);
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
  onCancel,
  paneSub,
  paneTitle,
  recalculate,
  sortingField,
  sortingDirection,
}) => {
  const {
    invalid,
    pristine,
    submitting,
  } = form.getState();

  const isSubmitDisabled = (
    form.getState()?.values?.calculatedFinanceData === null
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

  const onRecalculate = useCallback(async () => {
    const { fyFinanceData } = form.getState().values;

    try {
      const res = await recalculate({
        fyFinanceData: fyFinanceData.map(item => omit(item, ['_isMissed'])),
      });

      form.batch(() => {
        form.change('_isRecalculating', true);
        form.change('calculatedFinanceData', res.fyFinanceData);
        form.submit();
      });
    } catch (error) {
      showCallout({
        messageId: 'ui-finance.allocation.batch.form.recalculate.error',
        type: 'error',
      });
    }
  }, [form, recalculate, showCallout]);

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
          onClick={handleSubmit}
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
    <form>
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
          <FieldArray
            id="batch-allocation-list"
            name="fyFinanceData"
            component={BatchAllocationList}
            props={{
              fiscalYear,
              onHeaderClick: changeSorting,
              sortDirection: sortingDirection,
              sortedColumn: sortingField,
            }}
          />

          {
            Boolean(initialValues.invalidFunds?.length) && (
              <Layout className="marginTop1">
                <MessageBanner type="error">
                  <FormattedMessage id="ui-finance.allocation.batch.form.validation.error.invalidFunds" />
                </MessageBanner>
                <Layout className="marginTopHalf">
                  <List
                    items={initialValues.invalidFunds}
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
  onCancel: PropTypes.func.isRequired,
  paneSub: PropTypes.string.isRequired,
  paneTitle: PropTypes.string.isRequired,
  recalculate: PropTypes.func.isRequired,
  sortingField: PropTypes.string.isRequired,
  sortingDirection: PropTypes.string.isRequired,
};

export default stripesFinalForm({
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
})(BatchAllocationsForm);
