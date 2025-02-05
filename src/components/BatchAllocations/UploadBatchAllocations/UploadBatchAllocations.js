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
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

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
import { BatchAllocationsForm } from '../BatchAllocationsForm';
import { BATCH_ALLOCATION_SORTABLE_FIELDS } from '../constants';
import { useBatchAllocation, useSourceData } from '../hooks';
import { buildInitialValues } from './buildInitialValues';

export const UploadBatchAllocations = ({ match }) => {
  const history = useHistory();
  const location = useLocation();

  const { id: sourceId, fiscalYearId } = match.params;

  const sourceType = location.pathname.includes(LEDGERS_ROUTE) ?
    BATCH_ALLOCATIONS_SOURCE.ledger :
    BATCH_ALLOCATIONS_SOURCE.group;

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

  const backPathname = location.state?.backPathname || LEDGERS_ROUTE;

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

  const onSubmit = useCallback(async ({ budgetsFunds }) => {
    console.log('budgetsFunds', budgetsFunds);

    await localforage.removeItem(storageKey);
  }, [storageKey]);

  const onClose = useCallback(() => {
    history.push({ pathname: backPathname });
  }, [backPathname, history]);

  const isLoading = (
    isFileDataLoading
    || isFiscalYearLoading
    || isSourceDataLoading
    || isFinanceDataLoading
  );

  if (isLoading) return <LoadingView />;

  const initialValues = buildInitialValues(fileData?.data, financeData);

  return (
    <>
      <TitleManager record={fileData?.fileName} />
      <BatchAllocationsForm
        changeSorting={changeSorting}
        headline={fileData?.fileName}
        initialValues={initialValues}
        onCancel={onClose}
        onSubmit={onSubmit}
        paneSub={sourceData?.name}
        paneTitle={fiscalYear?.code}
        sortingDirection={sortingDirection}
        sortingField={sortingField}
      />
    </>
  );
};

UploadBatchAllocations.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};
