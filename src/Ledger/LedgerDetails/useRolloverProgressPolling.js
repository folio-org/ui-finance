import { useEffect, useState } from 'react';

import { useShowCallout } from '@folio/stripes-acq-components';

import { OVERALL_ROLLOVER_STATUS } from '../../common/const';

function useRolloverProgressPolling({ ledgerId, mutatorLedgerRolloverProgress, mutatorLedgerRollover }) {
  const [rolloverStatus, setRolloverStatus] = useState();
  const [rollover, setRollover] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const showCallout = useShowCallout();
  const overallRolloverStatus = rolloverStatus?.overallRolloverStatus;

  useEffect(() => {
    setIsLoading(true);
    const params = { query: `ledgerId=="${ledgerId}" sortby metadata.createdDate desc` };

    mutatorLedgerRollover.GET({ params }).then(([first, ..._rest]) => {
      setRollover(first);
      const progressParams = { query: `ledgerRolloverId=="${first?.id}" sortby metadata.createdDate desc` };

      return first?.id ? mutatorLedgerRolloverProgress.GET({ params: progressParams }) : [];
    })
      .then(
        (ledgerFiscalYearRolloverProgresses) => {
          setRolloverStatus(ledgerFiscalYearRolloverProgresses[0]);
        },
        () => {
          setRolloverStatus();
          showCallout({
            messageId: 'ui-finance.ledger.rolloverInProgress.errorLoadingRolloverProgress',
            type: 'error',
          });
        },
      ).finally(() => setIsLoading(false));
  }, [ledgerId, showCallout]);

  useEffect(() => {
    let runningInterval = null;

    if (overallRolloverStatus === OVERALL_ROLLOVER_STATUS.inProgress) {
      runningInterval = setInterval(() => {
        const params = { query: `ledgerRolloverId=="${rollover?.id}" sortby metadata.createdDate desc` };

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

  return { rolloverStatus, isLoading, rollover };
}

export default useRolloverProgressPolling;
