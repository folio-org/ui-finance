import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';

import { BROWSE_ROUTE } from '../../common/const';
import { useNavigationSettings } from '../../common/hooks';
import { getInitialRoute } from '../../components/Main/utils';
import { BROWSE_TABS } from '../constants';
import { SearchBrowseSegmentedControl } from '../SearchBrowseSegmentedControl';

/*
  Segmented control shared by the Search views (ledgers, groups, funds, fiscal years) and the Browse view.
  Renders only when the Browse tab is enabled in settings and navigates to the other view on tab change.
*/
const SearchTabControl = ({ activeTab }) => {
  const history = useHistory();
  const stripes = useStripes();
  const { navigationSettings } = useNavigationSettings();

  const handleTabChange = useCallback((tab) => {
    if (tab === activeTab) return;

    history.push(tab === BROWSE_TABS.BROWSE ? BROWSE_ROUTE : getInitialRoute(stripes));
  }, [activeTab, history, stripes]);

  if (!navigationSettings?.enabled) return null;

  return (
    <SearchBrowseSegmentedControl
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
};

SearchTabControl.propTypes = {
  activeTab: PropTypes.oneOf(Object.values(BROWSE_TABS)).isRequired,
};

export default SearchTabControl;
