import noop from 'lodash/noop';
import { useCallback } from 'react';
import {
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { LoadingView } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import { useSorting } from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
  BATCH_ALLOCATIONS_SOURCE,
} from '../../../common/const';
import { useFiscalYear } from '../../../common/hooks';
import { BatchAllocationsFormContainer } from '../BatchAllocationsForm';
import {
  BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
  BATCH_ALLOCATION_SORTABLE_FIELDS,
} from '../constants';
import {
  useBatchAllocation,
  useBatchAllocationFormHandler,
  useSourceData,
} from '../hooks';
import { resolveDefaultBackPathname } from '../utils';

export const CreateBatchAllocations = () => {
  const intl = useIntl();

  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const { id: sourceId, fiscalYearId } = match.params;

  const sourceType = location.pathname.includes(LEDGERS_ROUTE) ?
    BATCH_ALLOCATIONS_SOURCE.ledger :
    BATCH_ALLOCATIONS_SOURCE.group;

  const backPathname = location.state?.backPathname || resolveDefaultBackPathname(sourceType, sourceId);

  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useSorting(noop, BATCH_ALLOCATION_SORTABLE_FIELDS);

  const {
    budgetsFunds: financeData,
    isLoading: isFinanceDataLoading,
  } = useBatchAllocation({
    fiscalYearId,
    sortingDirection,
    sortingField,
    sourceId,
    sourceType,
  });

  const {
    data: sourceData,
    isLoading: isSourceDataLoading,
  } = useSourceData(sourceType, sourceId);

  const {
    fiscalYear,
    isLoading: isFiscalYearLoading,
  } = useFiscalYear(fiscalYearId);

  const {
    handle,
    isLoading: isBatchAllocationHandling,
  } = useBatchAllocationFormHandler();

  const onClose = useCallback(() => {
    history.push(backPathname);
  }, [history, backPathname]);

  const onSubmit = useCallback(async (
    { [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData]: fyFinanceData },
    form,
  ) => {
    await handle({
      fyFinanceData,
      initialValues: form.getState().initialValues,
      sourceId,
      sourceType,
    }).then(() => onClose());
  }, [handle, onClose, sourceId, sourceType]);

  const isLoading = (
    isFinanceDataLoading
    || isSourceDataLoading
    || isFiscalYearLoading
  );

  if (isLoading) {
    return (
      <LoadingView
        dismissible
        onClose={onClose}
      />
    );
  }

  const initialValues = {
    [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData]: (
      financeData
        ?.map((item) => ({
          ...BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
          ...item,
        }))
        ?.sort((a, b) => a.fundName.localeCompare(b.fundName))
    ),
    [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.calculatedFinanceData]: null,
  };

  return (
    <>
      <TitleManager record={intl.formatMessage({ id: 'ui-finance.actions.allocations.batch' })} />
      <BatchAllocationsFormContainer
        changeSorting={changeSorting}
        fiscalYear={fiscalYear}
        headline={<FormattedMessage id="ui-finance.allocation.batch.form.title.edit" />}
        initialValues={initialValues}
        isSubmitDisabled={isBatchAllocationHandling}
        onCancel={onClose}
        onSubmit={onSubmit}
        paneSub={sourceData.name}
        paneTitle={fiscalYear?.code}
        sortingDirection={sortingDirection}
        sortingField={sortingField}
      />
    </>
  );
};
