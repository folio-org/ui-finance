import noop from 'lodash/noop';
import React, { useCallback, useEffect } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { LoadingView } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import { useLocationSorting } from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
  GROUPS_ROUTE,
  BATCH_ALLOCATIONS_SOURCE,
} from '../../../common/const';
import { useFiscalYear } from '../../../common/hooks';
import { BatchAllocationsForm } from '../BatchAllocationsForm';
import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_SORTABLE_FIELDS,
} from '../constants';
import { useBatchAllocation, useSourceData } from '../hooks';

export const CreateBatchAllocations = ({ match }) => {
  const history = useHistory();
  const location = useLocation();
  const { id, fiscalYearId } = match.params;

  const sourceQueryKey = location.pathname.includes(LEDGERS_ROUTE) ? 'ledgerId' : 'groupId';

  const [
    changeSorting,
    sortingDirection,
    sortingField,
  ] = useLocationSorting(location, history, noop, BATCH_ALLOCATION_SORTABLE_FIELDS);

  const params = {
    query: `(fiscalYearId=="${fiscalYearId}" and ${sourceQueryKey}=="${id}") 
            sortby ${sortingField || BATCH_ALLOCATION_FIELDS.fundName}/sort.${sortingDirection || 'ascending'}`,
  };

  const { budgetsFunds, isLoading, refetch } = useBatchAllocation(params);

  const sourceType = location.pathname.includes(LEDGERS_ROUTE) ?
    BATCH_ALLOCATIONS_SOURCE.ledger :
    BATCH_ALLOCATIONS_SOURCE.group;

  const { data } = useSourceData(sourceType, id);
  const { fiscalYear } = useFiscalYear(fiscalYearId);

  const save = useCallback(async (formValues) => {
    console.log('formValues');
    console.log(formValues);
  }, []);

  const close = useCallback(
    () => {
      history.push({
        pathname: `${sourceType === BATCH_ALLOCATIONS_SOURCE.ledger ? LEDGERS_ROUTE : GROUPS_ROUTE}/${id}/view`,
        search: location.search,
      });
    },
    [history, location.search, id, sourceType],
  );

  const BATCH_EDIT_TITLE = <FormattedMessage id="ui-finance.allocation.batch.form.title.edit" />;

  if (isLoading) return <LoadingView />;

  return (
    <>
      <TitleManager record="Batch Allocation" />
      <BatchAllocationsForm
        changeSorting={changeSorting}
        headline={BATCH_EDIT_TITLE}
        initialValues={{ budgetsFunds }}
        onCancel={close}
        onSubmit={save}
        paneSub={data.name}
        paneTitle={fiscalYear?.code}
        resetData={refetch}
        sortingDirection={sortingDirection}
        sortingField={sortingField}
      />
    </>
  );
};

CreateBatchAllocations.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};
