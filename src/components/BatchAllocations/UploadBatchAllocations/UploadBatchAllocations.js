import localforage from 'localforage';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import {
  TitleManager,
  useNamespace,
} from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import {
  BATCH_ALLOCATIONS_SOURCE,
  BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY,
  LEDGERS_ROUTE,
} from '../../../common/const';
import { useFiscalYear } from '../../../common/hooks';
import { BatchAllocationsForm } from '../BatchAllocationsForm';
import { useSourceData } from '../hooks';

export const UploadBatchAllocations = () => {
  const history = useHistory();
  const location = useLocation();
  const { id, fiscalYearId } = useParams();

  const sourceType = location.pathname.includes(LEDGERS_ROUTE) ?
    BATCH_ALLOCATIONS_SOURCE.ledger :
    BATCH_ALLOCATIONS_SOURCE.group;

  const showCallout = useShowCallout();
  const [storageKey] = useNamespace({ key: BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY });

  const [data, setData] = useState();
  const [isDataLoading, setIsDataLoading] = useState();

  const {
    fiscalYear,
    isLoading: isFiscalYearLoading,
  } = useFiscalYear(fiscalYearId);

  const {
    data: sourceData,
    isLoading: isSourceDataLoading,
  } = useSourceData(sourceType, id);

  const backPathname = location.state?.backPathname || LEDGERS_ROUTE;

  useEffect(() => {
    setIsDataLoading(true);

    localforage.getItem(storageKey)
      .then(async (res) => {
        if (!res) {
          showCallout({
            messageId: 'ui-finance.batchAllocations.upload.error.notFound',
            type: 'error',
          });

          return;
        }

        setData(res);
        // await localforage.removeItem(storageKey); /* TODO: or remove after handling? */
      })
      .finally(() => {
        setIsDataLoading(false);
      });
  }, [showCallout, storageKey]);

  const onSubmit = useCallback((values) => {
    console.log('values', values);
  }, []);

  const onClose = useCallback(() => {
    history.push({ pathname: backPathname });
  }, [backPathname, history]);

  const initialValues = {
    budgetsFunds: data?.data,
  };

  return (
    <>
      <TitleManager record="Upload Allocation" />
      <BatchAllocationsForm
        headline={data?.fileName}
        initialValues={initialValues}
        onCancel={onClose}
        onSubmit={onSubmit}
        paneSub={sourceData?.name}
        paneTitle={fiscalYear?.code}
      />
    </>
  );
};
