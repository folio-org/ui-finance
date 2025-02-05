import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
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

import { BatchAllocationList } from './BatchAllocationList';

const BatchAllocationsForm = ({
  handleSubmit,
  headline,
  initialValues,
  onCancel,
  paneSub,
  paneTitle,
  pristine,
  submitting,
  sortingField,
  sortingDirection,
  changeSorting,
}) => {
  const closeForm = useCallback(() => onCancel(), [onCancel]);

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
          disabled={pristine || submitting}
          onClick={noop}
          type="submit"
        >
          <FormattedMessage id="ui-finance.allocation.batch.form.footer.recalculate" />
        </Button>
      </Col>
      <Col xs>
        <Button
          buttonStyle="primary mega"
          disabled={pristine || submitting}
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
            name="budgetsFunds"
            component={BatchAllocationList}
            props={{
              onHeaderClick: changeSorting,
              sortDirection: sortingDirection,
              sortedColumn: sortingField,
            }}
          />

          {
            Boolean(initialValues?.invalidFunds?.length) && (
              <Layout className="marginTop1">
                <MessageBanner type="error">
                  <FormattedMessage id="ui-finance.allocation.batch.form.validation.error.invalidFunds" />
                </MessageBanner>
                <Layout className="marginTopHalf">
                  <List
                    items={initialValues.invalidFunds}
                    itemFormatter={(item, i) => <li key={i}>{item.fundName || item.fundId}</li>}
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
  handleSubmit: PropTypes.func.isRequired,
  headline: PropTypes.string,
  initialValues: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  paneSub: PropTypes.string.isRequired,
  paneTitle: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  sortingField: PropTypes.string.isRequired,
  sortingDirection: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
})(BatchAllocationsForm);
