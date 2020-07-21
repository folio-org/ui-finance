import React from 'react';
import PropTypes from 'prop-types';
import {
  find,
  get,
  map,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { groupsResource } from '../../../common/resources';
import FieldFundGroups from './FieldFundGroups';

const itemToString = item => item;

function FieldFundGroupsContainer({ ariaLabelledBy, name, resources }) {
  const isLoading = !get(resources, 'groupsDict.hasLoaded');

  if (isLoading) return null;

  const groupsDict = get(resources, 'groupsDict.records') || [];
  const groupOptions = map(groupsDict, 'id');

  const formatter = ({ option }) => {
    const item = find(groupsDict, { id: option }) || option;

    if (!item) return option;

    return item.name;
  };

  const filter = (filterText, list) => {
    const renderedItems = filterText
      ? groupsDict
        .filter(group => group.name.toLowerCase().includes(filterText.toLowerCase()))
        .map(({ id }) => id)
      : list;

    return { renderedItems };
  };

  return (
    <FieldFundGroups
      ariaLabelledBy={ariaLabelledBy}
      name={name}
      dataOptions={groupOptions}
      itemToString={itemToString}
      formatter={formatter}
      filter={filter}
    />
  );
}

FieldFundGroupsContainer.manifest = Object.freeze({
  groupsDict: groupsResource,
});

FieldFundGroupsContainer.propTypes = {
  ariaLabelledBy: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(FieldFundGroupsContainer);
