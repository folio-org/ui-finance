# Browse Tab Feature

## Overview

The Browse tab feature provides a unified browsing experience across all finance entities (Ledgers, Groups, Funds, Budgets, Expense Classes) using fiscal year as the primary filter.

## JIRA Requirements

From the JIRA ticket "Display Browse tab in finance app":

1. **Display browse tab**: Search AND Browse tabs appear in segmented control above the reset all button
2. **Display browse tab filters**: When Browse is selected, show Ledger/Group/Fund/Budget/Expense Class status filters
3. **Display action menu**: Actions dropdown in the top right of the results pane
4. **Display action menu options**: New Fiscal year, New Ledger, New group, New fund

## File Structure

```
src/Browse/
├── index.js                          # Barrel exports
├── README.md                         # This file
├── constants.js                      # Tab types, filter names, status options
├── Browse.js                         # Main browse page component
├── SearchBrowseSegmentedControl/
│   ├── index.js
│   └── SearchBrowseSegmentedControl.js  # Search/Browse toggle buttons
├── BrowseFilters/
│   ├── index.js
│   └── BrowseFilters.js              # Filter accordions
└── BrowseActionsMenu/
    ├── index.js
    └── BrowseActionsMenu.js          # Actions dropdown

src/settings/NavigationSettings/
├── index.js
├── constants.js                      # Form field names, storage key
├── NavigationSettings.js             # Settings page component
└── NavigationSettingsForm.js         # Form UI

src/common/hooks/useBrowseTabEnabled/
├── index.js
└── useBrowseTabEnabled.js            # Hook to check if browse is enabled
```

## How It Works

### 1. Settings (Enable/Disable)

The NavigationSettings component in Settings > Finance > Navigation allows admins to enable/disable the Browse tab.

**IMPORTANT: This uses localStorage as a TEMPORARY solution.**

When the backend API is ready, replace localStorage with API calls. See the TODO comments in:
- `NavigationSettings.js` - save/load settings
- `useBrowseTabEnabled.js` - read settings

### 2. State Management

```
┌─────────────────────────┐
│  NavigationSettings     │
│  (saves to localStorage)│
└───────────┬─────────────┘
            │
            │ dispatches 'browse-tab-settings-changed' event
            ▼
┌─────────────────────────┐
│  useBrowseTabEnabled    │
│  (listens for events)   │
└───────────┬─────────────┘
            │
            │ returns boolean
            ▼
┌─────────────────────────┐
│  List Components        │
│  (conditionally render) │
└─────────────────────────┘
```

### 3. Navigation Flow

```
User clicks "Browse" tab
        ↓
history.push('/finance/browse')
        ↓
React Router renders Browse component
        ↓
Browse shows filters and Actions menu
```

### 4. Filter State Management

Filters are stored in URL query parameters for shareability:
```
/finance/browse?fiscalYearId=abc123&ledgerStatus=Active&fundStatus=Frozen
```

The `useLocationFilters` hook from `stripes-acq-components` handles syncing filter state with the URL.

## API Migration Guide

When the backend API becomes available:

### 1. Update NavigationSettings.js

Replace localStorage operations with API calls:

```javascript
// Current (localStorage):
const stored = localStorage.getItem(BROWSE_TAB_STORAGE_KEY);

// Future (API):
const { data } = await ky.get('/finance/navigation-settings').json();
```

### 2. Update useBrowseTabEnabled.js

Consider using React Query or SWR:

```javascript
import { useQuery } from 'react-query';

const useBrowseTabEnabled = () => {
  const ky = useOkapiKy();
  const { data } = useQuery(
    ['navigation-settings'],
    () => ky.get('/finance/navigation-settings').json(),
    { staleTime: 5 * 60 * 1000 }
  );
  return data?.enabled ?? false;
};
```

### 3. Remove Custom Events

If using React Query, cache invalidation replaces custom events:

```javascript
// In NavigationSettings after save:
queryClient.invalidateQueries(['navigation-settings']);
```

## Testing

### Manual Testing

1. Go to Settings > Finance > Navigation
2. Check "Enable browse tab" and click Save
3. Navigate to Finance app
4. Verify Search/Browse toggle appears in all list views
5. Click Browse to access the browse view
6. Verify all filters are present
7. Verify Actions menu has all create options

### Unit Tests

Add tests for:
- `SearchBrowseSegmentedControl.test.js`
- `BrowseFilters.test.js`
- `BrowseActionsMenu.test.js`
- `useBrowseTabEnabled.test.js`

## Translations

All UI text uses react-intl. Translation keys are in:
`translations/ui-finance/en.json`

Keys added:
- `browse.tab.search` / `browse.tab.browse`
- `browse.title` / `browse.subtitle`
- `browse.filter.*`
- `browse.actions.*`
- `browse.selectFiscalYear` / `browse.noResults`

