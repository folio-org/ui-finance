import { ResponseErrorsContainer } from '@folio/stripes-acq-components';

import { genericErrorStrategy } from './strategies';

export const handleCommonErrorResponse = async ({ response }, params) => {
  const { handler } = await ResponseErrorsContainer.create(response);

  return handler.handle(genericErrorStrategy(params));
};
