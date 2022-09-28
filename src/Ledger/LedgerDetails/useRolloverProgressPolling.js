import { useEffect, useState } from 'react';

import { useShowCallout } from '@folio/stripes-acq-components';

import {
  LEDGER_ROLLOVER_TYPES,
  OVERALL_ROLLOVER_STATUS,
} from '../../common/const';

function useRolloverProgressPolling({
  ledgerId,
  mutatorLedgerRolloverProgress,
  mutatorLedgerRollover,
  mutatorToFiscalYear,
}) {
  const [rolloverStatus, setRolloverStatus] = useState();
  const [rollover, setRollover] = useState();
  const [rolloverToFY, setRolloverToFY] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const showCallout = useShowCallout();
  const overallRolloverStatus = rolloverStatus?.overallRolloverStatus;

  useEffect(() => {
    setIsLoading(true);
    const params = { query: `(ledgerId=="${ledgerId}" and rolloverType=="${LEDGER_ROLLOVER_TYPES.commit}") sortby metadata.createdDate/sort.descending` };

    mutatorLedgerRollover.GET({ params }).then(([first, ..._rest]) => {
      setRollover(first);
      const progressParams = { query: `ledgerRolloverId=="${first?.id}" sortby metadata.createdDate/sort.descending` };

      return !first?.id ? [] : Promise.all([
        mutatorLedgerRolloverProgress.GET({ params: progressParams }),
        mutatorToFiscalYear.GET({ params: { query: `id=="${first.toFiscalYearId}"` } }),
      ]);
    })
      .then(
        ([ledgerFiscalYearRolloverProgresses, toFiscalYears]) => {
          setRolloverStatus(ledgerFiscalYearRolloverProgresses?.[0]);
          setRolloverToFY(toFiscalYears?.[0]);
        },
        () => {
          setRolloverStatus();
          setRolloverToFY();
          console.error('Error loading Rollover progress or To fiscal year');
        },
      ).finally(() => setIsLoading(false));
  }, [ledgerId]);

  useEffect(() => {
    let runningInterval = null;

    if (overallRolloverStatus === OVERALL_ROLLOVER_STATUS.inProgress) {
      runningInterval = setInterval(() => {
        const params = { query: `ledgerRolloverId=="${rollover?.id}" sortby metadata.createdDate/sort.descending` };

        mutatorLedgerRolloverProgress.GET({ params })
          .then((ledgerFiscalYearRolloverProgresses) => {
            if (ledgerFiscalYearRolloverProgresses[0]?.overallRolloverStatus !== OVERALL_ROLLOVER_STATUS.inProgress) {
              clearInterval(runningInterval);
              setRolloverStatus(ledgerFiscalYearRolloverProgresses[0]);
            } else {
              setRolloverStatus((prev) => ({
                ...prev,
                ...ledgerFiscalYearRolloverProgresses[0],
              }));
            }
          });
      }, 10000);
    }

    return () => clearInterval(runningInterval);
  }, [ledgerId, showCallout, overallRolloverStatus, rollover]);

  return { rolloverStatus, isLoading, rollover, rolloverToFY };
}

export default useRolloverProgressPolling;
