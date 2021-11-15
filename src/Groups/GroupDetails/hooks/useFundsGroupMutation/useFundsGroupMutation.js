import { chunk } from 'lodash';

import { useFundGroupMutation } from '../useFundGroupMutation';

export const useFundsGroupMutation = hydrate => {
  const { mutateFundGroup } = useFundGroupMutation();

  const mutateFundsGroup = funds => {
    if (!funds?.length) return Promise.resolve([]);

    return chunk(funds, 1).reduce((acc, fundsChunk) => {
      return acc.then(() => {
        const chunkRequests = fundsChunk.map(fund => mutateFundGroup({ fund, hydrate }));

        return Promise.all(chunkRequests);
      });
    }, Promise.resolve());
  };

  return {
    mutateFundsGroup,
  };
};
