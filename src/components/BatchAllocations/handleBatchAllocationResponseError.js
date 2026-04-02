import { ResponseErrorsContainer } from '@folio/stripes-acq-components';

import { genericErrorStrategy } from '../../common/utils/errorHandling/strategies';

export const handleBatchAllocationResponseError = async (response, sendCallout, intl) => {
  const { handler } = await ResponseErrorsContainer.create(response);

  return handler.handle(genericErrorStrategy({
    callout: { sendCallout },
    defaultMessageId: 'ui-finance.actions.allocations.batch.error',
    intl,
  }));
};
