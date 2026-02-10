import noop from 'lodash/noop';
import {
  useCallback,
  useMemo,
} from 'react';
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
import {
  useShowCallout,
  useSorting,
} from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
  BATCH_ALLOCATIONS_SOURCE,
} from '../../../common/const';
import { useFiscalYear } from '../../../common/hooks';
import { BatchAllocationsFormContainer } from '../BatchAllocationsForm';
import {
  BATCH_ALLOCATION_FLOW_TYPE,
  BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
  BATCH_ALLOCATION_SORTABLE_FIELDS,
} from '../constants';
import {
  useBatchAllocation,
  useBatchAllocationFormHandler,
  useSourceCurrentFiscalYears,
  useSourceData,
} from '../hooks';
import { resolveDefaultBackPathname } from '../utils';

export const CreateBatchAllocations = () => {
  const intl = useIntl();
  const showCallout = useShowCallout();

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
    isFetching: isFinanceDataFetching,
    isLoading: isFinanceDataLoading,
  } = useBatchAllocation(
    {
      fiscalYearId,
      sortingDirection,
      sortingField,
      sourceId,
      sourceType,
    },
    { keepPreviousData: true },
  );

  const {
    data: sourceData,
    isFetching: isSourceDataFetching,
    isLoading: isSourceDataLoading,
  } = useSourceData(
    sourceType,
    sourceId,
    { keepPreviousData: true },
  );

  const {
    fiscalYear,
    isLoading: isFiscalYearLoading,
  } = useFiscalYear(fiscalYearId);

  const {
    currentFiscalYears,
    isLoading: isCurrentFiscalYearsLoading,
  } = useSourceCurrentFiscalYears(sourceType, sourceId);

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
      initialValues: form.getFormState().initialValues,
      sourceId,
      sourceType,
    })
      .then(() => onClose())
      .catch(() => {
        showCallout({
          messageId: 'ui-finance.actions.allocations.batch.error',
          type: 'error',
        });
      });
  }, [
    handle,
    onClose,
    showCallout,
    sourceId,
    sourceType,
  ]);

  const initialValues = useMemo(() => ({
    [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData]: (
      financeData?.map((item) => ({
        ...BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
        ...item,
      }))
    ),
    [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.calculatedFinanceData]: null,
  }), [financeData]);

  const isFetching = isFinanceDataFetching || isSourceDataFetching;

  const isLoading = (
    isFinanceDataLoading
    || isSourceDataLoading
    || isFiscalYearLoading
    || isCurrentFiscalYearsLoading
  );

  if (isLoading) {
    return (
      <LoadingView
        dismissible
        onClose={onClose}
      />
    );
  }

  return (
    <>
      <TitleManager record={intl.formatMessage({ id: 'ui-finance.actions.allocations.batch' })} />
      <BatchAllocationsFormContainer
        changeSorting={changeSorting}
        currentFiscalYears={currentFiscalYears}
        fiscalYear={fiscalYear}
        headline={<FormattedMessage id="ui-finance.allocation.batch.form.title.edit" />}
        initialValues={initialValues}
        isBatchAllocationHandling={isBatchAllocationHandling}
        isLoading={isFetching || isBatchAllocationHandling}
        isRecalculateDisabled={isBatchAllocationHandling}
        isSubmitDisabled={isBatchAllocationHandling}
        onCancel={onClose}
        onSubmit={onSubmit}
        paneSub={sourceData.name}
        paneTitle={fiscalYear?.code}
        sortingDirection={sortingDirection}
        sortingField={sortingField}
        flowType={BATCH_ALLOCATION_FLOW_TYPE.CREATE}
      />
    </>
  );
};
