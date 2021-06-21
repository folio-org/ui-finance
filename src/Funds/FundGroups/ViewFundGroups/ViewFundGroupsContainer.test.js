import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ViewFundGroupsContainer from './ViewFundGroupsContainer';

const renderViewFundGroupsContainer = () => render(
  <ViewFundGroupsContainer
    groupIds={['id']}
    resources={{ groupsDict: { records: [{ id: 'id', name: 'name' }], hasLoaded: true } }}
  />,
  { wrapper: MemoryRouter },
);

describe('ViewFundGroupsContainer', () => {
  it('should render ViewFundGroups', () => {
    const { getByText } = renderViewFundGroupsContainer();

    expect(getByText('ui-finance.fund.information.group')).toBeDefined();
  });
});
