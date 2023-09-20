import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldFundGroupsContainer from './FieldFundGroupsContainer';

jest.mock('./FieldFundGroups', () => jest.fn().mockReturnValue('FieldFundGroups'));

const defaultProps = {
  resources: { groupsDict: { hasLoaded: true, records: [] } },
  name: 'fieldName',
};

const renderFieldFundGroupsContainer = (props = defaultProps) => render(
  <FieldFundGroupsContainer {...props} />,
);

describe('FieldFundGroupsContainer', () => {
  it('should display FieldFundGroups', () => {
    renderFieldFundGroupsContainer();

    expect(screen.getByText('FieldFundGroups')).toBeDefined();
  });
});
