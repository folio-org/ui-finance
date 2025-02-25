import localforage from 'localforage';
import noop from 'lodash/noop';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import { LoadingView } from '@folio/stripes/components';
import {
  TitleManager,
  useNamespace,
} from '@folio/stripes/core';
import {
  useShowCallout,
  useSorting,
} from '@folio/stripes-acq-components';

import {
  BATCH_ALLOCATIONS_SOURCE,
  BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY,
  LEDGERS_ROUTE,
} from '../../../common/const';
import { useFiscalYear } from '../../../common/hooks';
import { BatchAllocationsFormContainer } from '../BatchAllocationsForm';
import {
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
  BATCH_ALLOCATION_SORTABLE_FIELDS,
} from '../constants';
import {
  useBatchAllocation,
  useBatchAllocationFormHandler,
  useSourceData,
} from '../hooks';
import { resolveDefaultBackPathname } from '../utils';
import { buildInitialValues } from './buildInitialValues';

export const UploadBatchAllocations = () => {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const { id: sourceId, fiscalYearId } = match.params;

  const sourceType = location.pathname.includes(LEDGERS_ROUTE) ?
    BATCH_ALLOCATIONS_SOURCE.ledger :
    BATCH_ALLOCATIONS_SOURCE.group;

  const backPathname = location.state?.backPathname || resolveDefaultBackPathname(sourceType, sourceId);

  const showCallout = useShowCallout();
  const [storageKey] = useNamespace({ key: BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY });

  const [fileData, setFileData] = useState();
  const [isFileDataLoading, setIsFileDataLoading] = useState();

  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useSorting(noop, BATCH_ALLOCATION_SORTABLE_FIELDS);

  const {
    fiscalYear,
    isLoading: isFiscalYearLoading,
  } = useFiscalYear(fiscalYearId);

  const {
    data: sourceData,
    isLoading: isSourceDataLoading,
  } = useSourceData(sourceType, sourceId);

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
    handle,
    isLoading: isBatchAllocationHandling,
  } = useBatchAllocationFormHandler();

  useEffect(() => {
    setIsFileDataLoading(true);

    localforage.getItem(storageKey)
      .then(async (res) => {
        if (!res) {
          showCallout({
            messageId: 'ui-finance.batchAllocations.upload.error.notFound',
            type: 'error',
          });

          return;
        }

        setFileData(res);
      })
      .finally(() => {
        setIsFileDataLoading(false);
      });
  }, [showCallout, storageKey]);

  const onClose = useCallback(() => {
    history.push(backPathname);
  }, [backPathname, history]);

  const onSubmit = useCallback(async (
    { [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData]: fyFinanceData },
    form,
  ) => {
    await handle({
      fyFinanceData,
      initialValues: form.getState().initialValues,
      sourceId,
      sourceType,
    })
      .then(() => localforage.removeItem(storageKey))
      .then(() => onClose());
  }, [handle, onClose, sourceId, sourceType, storageKey]);

  const isLoading = (
    isFileDataLoading
    || isFiscalYearLoading
    || isSourceDataLoading
    || isFinanceDataLoading
  );

  if (isLoading) {
    return (
      <LoadingView
        dismissible
        onClose={onClose}
      />
    );
  }

  const initialValues = buildInitialValues(fileData?.data, financeData, fiscalYear);

  console.log(initialValues)

  return (
    <>
      <TitleManager record={fileData?.fileName} />
      <BatchAllocationsFormContainer
        changeSorting={changeSorting}
        fiscalYear={fiscalYear}
        headline={fileData?.fileName}
        initialValues={initialValues}
        isSubmitDisabled={isBatchAllocationHandling}
        onCancel={onClose}
        onSubmit={onSubmit}
        paneSub={sourceData?.name}
        paneTitle={fiscalYear?.code}
        recalculateOnInit
        sortingDirection={sortingDirection}
        sortingField={sortingField}
      />
    </>
  );
};
