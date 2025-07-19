import PropTypes from 'prop-types';
import { useCallback } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Col,
  IconButton,
  Modal,
  ModalFooter,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import {
  FieldSelectionFinal,
  FieldTags,
  validateRequiredPositiveAmount,
} from '@folio/stripes-acq-components';

import {
  composeValidators,
  validateTransactionForm,
} from '../../common/utils';
import { ALLOCATION_TYPE } from '../constants';
import { validateAllocationAmount } from './utils';

import css from './CreateTransactionModal.css';

const defaultFundsOptions = [];

const CreateTransactionModal = ({
  allocationType,
  budget,
  form,
  fundId,
  handleSubmit,
  isFundsLoading,
  isLoading,
  onClose,
  fundsOptions = defaultFundsOptions,
  title,
  values: formValues,
}) => {
  const stripes = useStripes();
  const intl = useIntl();

  const { invalid } = form.getState();

  const hasToFundIdProperty = 'toFundId' in formValues;
  const hasFromFundIdProperty = 'fromFundId' in formValues;
  const fundLabelId = allocationType ? 'ui-finance.fund' : '';
  const { fromFundId, toFundId } = formValues;

  let isToFundVisible = true;
  let isFromFundVisible = true;

  if (allocationType && allocationType === ALLOCATION_TYPE.increase) {
    isFromFundVisible = false;
  }

  if (allocationType && allocationType === ALLOCATION_TYPE.decrease) {
    isToFundVisible = false;
  }

  const isConfirmButtonDisabled = isLoading || invalid;

  const optionsFrom = (
    (!hasToFundIdProperty || formValues.toFundId === fundId)
      ? fundsOptions
      : fundsOptions.filter(f => f.value === fundId)
  );

  const optionsTo = (
    (!hasFromFundIdProperty || formValues.fromFundId === fundId)
      ? fundsOptions
      : fundsOptions.filter(f => f.value === fundId)
  );

  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        data-test-add-transfer-save
        onClick={handleSubmit}
        disabled={isConfirmButtonDisabled}
      >
        <FormattedMessage id="ui-finance.transaction.button.confirm" />
      </Button>
      <Button
        data-test-add-transfer-cancel
        onClick={onClose}
      >
        <FormattedMessage id="ui-finance.transaction.button.cancel" />
      </Button>
    </ModalFooter>
  );

  const swapFunds = useCallback(() => {
    form.batch(() => {
      form.change('toFundId', fromFundId);
      form.change('fromFundId', toFundId);
    });
  }, [form, fromFundId, toFundId]);

  return (
    <Modal
      id="add-transfer-modal"
      aria-label={title}
      label={title}
      footer={footer}
      open
      enforceFocus={false}
      contentClass={css['transaction-modal-content']}
    >
      <form>
        <Row>
          {isFromFundVisible && (
            <Col xs>
              <FieldSelectionFinal
                key={fromFundId}
                dataOptions={optionsFrom}
                label={<FormattedMessage id={fundLabelId || 'ui-finance.transaction.from'} />}
                name="fromFundId"
                disabled={!!allocationType}
                loading={isFundsLoading}
              />
            </Col>
          )}

          {isFromFundVisible && isToFundVisible && (
            <IconButton
              ariaLabel={intl.formatMessage({ id: 'ui-finance.transaction.button.switchFunds' })}
              className={css.swap}
              icon="replace"
              onClick={swapFunds}
              disabled={isFundsLoading}
            />
          )}

          {isToFundVisible && (
            <Col xs>
              <FieldSelectionFinal
                key={toFundId}
                dataOptions={optionsTo}
                label={<FormattedMessage id={fundLabelId || 'ui-finance.transaction.to'} />}
                name="toFundId"
                disabled={!!allocationType}
                loading={isFundsLoading}
              />
            </Col>
          )}
        </Row>
        <Row>
          <Col xs>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-finance.transaction.amount" />}
              name="amount"
              type="number"
              required
              validate={composeValidators(
                validateRequiredPositiveAmount,
                validateAllocationAmount(allocationType, budget, stripes.currency),
              )}
            />
          </Col>

          <Col xs>
            <FieldTags name="tags.tagList" />
          </Col>
        </Row>
        <Row>
          <Col xs>
            <Field
              component={TextArea}
              label={<FormattedMessage id="ui-finance.transaction.description" />}
              name="description"
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

CreateTransactionModal.propTypes = {
  allocationType: PropTypes.string,
  budget: PropTypes.shape({
    allocated: PropTypes.number.isRequired,
  }).isRequired,
  form: PropTypes.object.isRequired,
  fundId: PropTypes.string.isRequired,
  fundsOptions: PropTypes.arrayOf(PropTypes.object),
  handleSubmit: PropTypes.func.isRequired,
  isFundsLoading: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
  validate: validateTransactionForm,
})(CreateTransactionModal);
