import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { GROUPS_ROUTE } from '../../common/const';
import GroupDetails from './GroupDetails';
import { GroupDetailsContainer } from './GroupDetailsContainer';
import { getGroupSummary } from './utils';

jest.mock('./utils', () => ({ getGroupSummary: jest.fn() }));
jest.mock('./GroupDetails', () => jest.fn().mockReturnValue('GroupDetails'));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useAllFunds: jest.fn().mockReturnValue({ funds: [] }),
}));

const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
};
const mutatorMock = {
  groupDetails: {
    GET: jest.fn(),
    DELETE: jest.fn(),
  },
  groupFiscalYears: {
    GET: jest.fn().mockReturnValue(Promise.resolve([{ id: 'fyId' }])),
  },
  groupSummaries: {
    GET: jest.fn().mockReturnValue(Promise.resolve([{}])),
  },
};
const defaultProps = {
  mutator: mutatorMock,
  match: { params: { id: 'groupId' }, path: 'path', url: 'url' },
  history: historyMock,
  location: { hash: 'hash', pathname: 'pathname', search: 'search' },
};
const renderGroupDetailsContainer = (props = defaultProps) => render(
  <GroupDetailsContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('GroupDetailsContainer', () => {
  beforeEach(() => {
    historyMock.push.mockClear();
  });
  it('should display GroupDetails', async () => {
    await act(async () => renderGroupDetailsContainer());

    await screen.findByText('GroupDetails');

    expect(screen.getByText('GroupDetails')).toBeDefined();
  });

  describe('Actions', () => {
    it('should navigate to list close action is called', async () => {
      await act(async () => renderGroupDetailsContainer());

      GroupDetails.mock.calls[0][0].onClose();

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(GROUPS_ROUTE);
    });

    it('should navigate to form', async () => {
      await act(async () => renderGroupDetailsContainer());

      GroupDetails.mock.calls[0][0].editGroup();

      expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${GROUPS_ROUTE}/${defaultProps.match.params.id}/edit`);
    });

    it('select FY', async () => {
      getGroupSummary.mockReturnValue(Promise.resolve({}));

      await act(async () => renderGroupDetailsContainer());

      GroupDetails.mock.calls[0][0].onSelectFY('newFYId');

      expect(getGroupSummary).toHaveBeenCalled();
    });

    it('should remove', async () => {
      mutatorMock.groupDetails.DELETE.mockReturnValue(Promise.resolve({}));

      await act(async () => renderGroupDetailsContainer());

      GroupDetails.mock.calls[0][0].removeGroup();

      expect(mutatorMock.groupDetails.DELETE).toHaveBeenCalled();
    });
  });
});
