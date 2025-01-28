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

import { useNamespace } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import {
  BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY,
  LEDGERS_ROUTE,
} from '../../../common/const';
import { useFiscalYear } from '../../../common/hooks';
import { BatchAllocationsForm } from '../BatchAllocationsForm';

export const UploadBatchAllocations = () => {
  const history = useHistory();
  const location = useLocation();
  const { fiscalYearId, sourceType } = useParams();

  const showCallout = useShowCallout();
  const [storageKey] = useNamespace({ key: BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY });

  const [data, setData] = useState();
  const [isDataLoading, setIsDataLoading] = useState();

  const {
    fiscalYear,
    isLoading: isFiscalYearLoading,
  } = useFiscalYear(fiscalYearId);

  console.log('sourceType', sourceType);

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

  console.log(data);
  console.log(location);
  console.log(backPathname);

  const onSubmit = useCallback(() => {

  }, []);

  const onClose = useCallback(() => {
    history.push({ pathname: backPathname });
  }, [backPathname, history]);

  return (
    <BatchAllocationsForm
      fiscalYear={fiscalYear}
      // paneSub={}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};
