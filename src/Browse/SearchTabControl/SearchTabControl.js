import { useHistory } from 'react-router-dom';

import { BROWSE_ROUTE } from '../../common/const';
import { useBrowseTabEnabled } from '../../common/hooks';
import { BROWSE_TABS } from '../constants';
import { SearchBrowseSegmentedControl } from '../SearchBrowseSegmentedControl';

/*
  Segmented control for the Search views (ledgers, groups, funds, fiscal years).
  Renders only when the Browse tab is enabled in settings.
*/
const SearchTabControl = () => {
  const history = useHistory();
  const { isBrowseTabEnabled } = useBrowseTabEnabled();

  if (!isBrowseTabEnabled) return null;

  return (
    <SearchBrowseSegmentedControl
      activeTab={BROWSE_TABS.SEARCH}
      onTabChange={(tab) => tab === BROWSE_TABS.BROWSE && history.push(BROWSE_ROUTE)}
    />
  );
};

export default SearchTabControl;
