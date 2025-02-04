import noop from 'lodash/noop';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import { LoadingView } from '@folio/stripes/components';
import {
  IntlConsumer,
  TitleManager,
} from '@folio/stripes/core';
import { useLocationSorting } from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
  GROUPS_ROUTE,
  BATCH_ALLOCATIONS_SOURCE,
} from '../../../common/const';
import { useFiscalYear } from '../../../common/hooks';
import { BatchAllocationsForm } from '../BatchAllocationsForm';
import { BATCH_ALLOCATION_SORTABLE_FIELDS } from '../constants';
import { useBatchAllocation, useSourceData } from '../hooks';

export const CreateBatchAllocations = ({ match }) => {
  const history = useHistory();
  const location = useLocation();
  const { id: sourceId, fiscalYearId } = match.params;
  const sourceType = location.pathname.includes(LEDGERS_ROUTE) ? 'ledgerId' : 'groupId';
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, noop, BATCH_ALLOCATION_SORTABLE_FIELDS);

  const { budgetsFunds, isLoading } = useBatchAllocation({
    fiscalYearId,
    sortingDirection,
    sortingField,
    sourceId,
    sourceType,
  });

  const source = location.pathname.includes(LEDGERS_ROUTE) ?
    BATCH_ALLOCATIONS_SOURCE.ledger :
    BATCH_ALLOCATIONS_SOURCE.group;
  const { data } = useSourceData(source, sourceId);
  const { fiscalYear } = useFiscalYear(fiscalYearId);

  const save = useCallback(async (formValues) => {
    console.log('formValues');
    console.log(formValues);
  }, []);

  const close = useCallback(() => {
    history.push({
      pathname: `${sourceType === 'ledgerId' ? LEDGERS_ROUTE : GROUPS_ROUTE}/${sourceId}/view`,
      search: location.search,
    });
  }, [history, location.search, sourceId, sourceType]);

  const BATCH_EDIT_TITLE = <FormattedMessage id="ui-finance.allocation.batch.form.title.edit" />;

  if (isLoading) return <LoadingView />;

  return (
    <>
      <IntlConsumer>
        {intl => <TitleManager record={intl.formatMessage({ id: 'ui-finance.actions.allocations.batch' })} />}
      </IntlConsumer>
      <BatchAllocationsForm
        changeSorting={changeSorting}
        headline={BATCH_EDIT_TITLE}
        initialValues={{ budgetsFunds }}
        onCancel={close}
        onSubmit={save}
        paneSub={data.name}
        paneTitle={fiscalYear?.code}
        sortingDirection={sortingDirection}
        sortingField={sortingField}
      />
    </>
  );
};

CreateBatchAllocations.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};
