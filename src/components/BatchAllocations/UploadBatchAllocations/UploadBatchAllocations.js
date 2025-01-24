import localforage from 'localforage';
import {
  useEffect,
  useState,
} from 'react';

import { useNamespace } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import { BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY } from '../../../common/const';

export const UploadBatchAllocations = () => {
  const showCallout = useShowCallout();
  const [storageKey] = useNamespace({ key: BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY });
  const [data, setData] = useState();

  useEffect(() => {
    localforage.getItem('123')
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
      });
  }, [showCallout, storageKey]);

  console.log(data);

  return (
    <div>upload</div>
  );
};
