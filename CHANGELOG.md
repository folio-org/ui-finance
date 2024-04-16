# Change history for ui-finance

## 7.0.0 (IN PROGRESS)

* Utilize the translation key from `stripes-components` for the "Save & Close" button label. Refs UIF-447.
* UX Consistency: HTML page title display when third pane (detail record) displays. Refs UIF-502.
* *BREAKING* Apply changes in the fund schema for the locations field. Refs UIF-518.
* *BREAKING* Align the `finance.*` interfaces versions in accordance with the changes in the descriptor. Refs UIF-520.

## [6.0.0](https://github.com/folio-org/ui-finance/tree/v6.0.0) (2024-03-19)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v5.0.0...v6.0.0)

* Add donor info to Fund. Refs UIF-473.
* Designate funds as location use restricted. Refs UIF-482.
* Assign locations to restricted funds. Refs UIF-484.
* Allow user to recalculate budgets based on conducted transactions when desired. Refs UIF-491.
* Incorrect Display of Expense Class Percent. Refs UIF-509.
* Make location association required when funds are restricted by location. Refs UIF-492.
* *BREAKING* Add "Unrelease encumbrance" action to encumbrance transaction view. Refs UIF-503.
* UX Consistency > Search results > Update HTML page title with search term entered. Refs UIF-501.

## [5.0.0](https://github.com/folio-org/ui-finance/tree/v5.0.0) (2023-10-12)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v4.0.4...v5.0.0)

* A user cannot type anything in the list of filter options for the "Status" field in the fund form. Refs UIF-458.
* Filter in "Transfer from" and "Transfer to" fields does not work when creating a new fund. Refs UIF-457.
* Download budget results for failed rollovers. Refs UIF-415.
* Block test rollover once rollover has been done for given ledger and FYs. Refs UIF-465.
* Update Node.js to v18 in GitHub Actions. Refs UIF-471.
* Need new permission(s) to view Finance settings in UI. Refs UIF-442.
* *BREAKING* bump `react-intl` to `v6.4.4`. Refs UIF-472.
* *BREAKING* bump `react` to `v18.2.0`Refs UIF-470.
* Show an alert when decreasing allocation results in a negative available amount. Refs UIF-464.
* Display `0` instead of `Undefined` in the "Percent of total expended" column. Refs UIF-479.
* Bump optional plugins to their `@folio/stripes` `v9` compatible versions. Refs UIF-476.

## [4.0.4](https://github.com/folio-org/ui-finance/tree/v4.0.4) (2023-03-31)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v4.0.3...v4.0.4)

* After performing the test rollover, only the last 10 budgets are displayed. Refs UIF-455
* Avoid private paths in stripes-core imports. Refs UIF-453.

## [4.0.3](https://github.com/folio-org/ui-finance/tree/v4.0.3) (2023-03-24)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v4.0.2...v4.0.3)

* translation updates

## [4.0.2](https://github.com/folio-org/ui-finance/tree/v4.0.2) (2023-03-24)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v4.0.1...v4.0.2)

* Display FY start/end in UTC. Refs UIF-357.

## [4.0.1](https://github.com/folio-org/ui-finance/tree/v4.0.1) (2023-03-10)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v4.0.0...v4.0.1)

* NPE in GroupDetails if a Ledger does not have an active fiscal year. Refs UIF-446

## [4.0.0](https://github.com/folio-org/ui-finance/tree/v4.0.0) (2023-02-23)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v3.3.2...v4.0.0)

* UX: Spacing of rollover buttons on Finance app. Refs  UIF-417.
* Provide local translations to `ControlledVocab`. Refs UIF-408.
* Results List | Hyperlink one column to improve accessibility. Refs UIF-410.
* Refactoring flow and error handling to create a transaction. Refs UIF-429.
* Show alert when the transfer will result in a negative amount. Refs UIF-427.
* *BREAKING*: Update `@folio/stripes` to `8.0.0`. Refs UIF-430.
* Add rollover budget "Cash balance" setting to rollover screen. Refs UIF-440.
* Add possibility to display FY rollover settings for each rollover AND test rollover. Refs UIF-443.
* Unpin `@rehooks/local-storage` now that it's no longer broken. Refs UIF-431.

## [3.3.2](https://github.com/folio-org/ui-finance/tree/v3.3.2) (2022-11-30)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v3.3.1...v3.3.2)

* Handle fiscal year code validation error `invalidFiscalYearCode`. Refs UIF-422.
* Incorrect fund name in the toast message for successful moving allocation. Refs UIF-414.
* Loose plugin dependencies permit incompatible versions. Refs UIF-423.
* "No results found" shown after return to search page. Refs UIF-424.

## [3.3.1](https://github.com/folio-org/ui-finance/tree/v3.3.1) (2022-11-11)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v3.3.0...v3.3.1)

* Previous fiscal year selected by default when viewing group records. Refs UIF-419.

## [3.3.0](https://github.com/folio-org/ui-finance/tree/v3.3.0) (2022-10-25)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v3.2.1...v3.3.0)

* Support `users` interface version `16.0`. Refs UIF-405.
* Alert user of unpaid invoices during rollover. Refs UIF-378.
* Add test rollover action to rollover settings. Refs UIF-393.
* Fiscal year rollover test confirmation modal. Refs UIF-395.
* Export list of unpaid invoices. Refs UIF-394.
* Add `Rollover logs` action to `Ledger` menu. Refs UIF-396.
* Implement `Rollover logs` view. Refs UIF-397.
* Add message to unpaid invoices modal. Refs UIF-399.
* Missing interfaces causes failure of platform-complete build. Refs UIF-401.
* Update the error for rollover uniqueness. Refs UIF-412.
* Integrate `Rollover logs` list with BE. Refs UIF-413.
* Download budget results from `Rollover logs` page. Refs UIF-415.
* Possibility to close `Rollover logs` pane. Refs UIF-416.

## [3.2.1](https://github.com/folio-org/ui-finance/tree/v3.2.1) (2022-08-03)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v3.2.0...v3.2.1)

* Settings: Export code list typo in the green toast message. Refs UIF-403.
* `New` button for `Planned budget` unexpected behavior. Refs UIF-402.
* User with "Settings (Finance): View, edit, create, delete" cannot export codes. Refs UIF-406.

## [3.2.0](https://github.com/folio-org/ui-finance/tree/v3.2.0) (2022-07-08)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v3.1.1...v3.2.0)

* Allow user to create multiple planned budgets. Refs UIF-359.
* Select filter should announce the number of Results in the Results List pane header. Refs UIF-371.
* Display export action for ledger. Refs UIF-365.
* User must select fiscal year and expense class settings for export. Refs UIF-366.
* Start export budgets with confirmed settings. Refs UIF-367.
* Create csv file with all budget data. Refs UIF-368.
* Replace `babel-eslint` with `@babel/eslint-parser`. Refs UIF-374.
* UI-Finance: module warnings analysis. Refs UIF-376.
* Identify record type for common fields in budget export. Refs UIF-384.
* Filter transactions by source POL or Vendor invoice number. Refs UIF-383.
* Finance optimistic locking. Refs UIF-379.
* Deleted item name remains in the list on the pane (fiscal year, ledger, group, fund). Refs UIF-390.
* Warning message for already existing field does not appear when click after duplicated field on the dropdown with filter options list. Refs UIF-391.
* Order rollover errors are not reported. Refs UIF-392.

## [3.1.1](https://github.com/folio-org/ui-finance/tree/v3.1.1) (2022-03-31)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v3.1.0...v3.1.1)

* exportCsv is deprecated in stripes-utils. Refs UIF-364.

## [3.1.0](https://github.com/folio-org/ui-finance/tree/v3.1.0) (2022-03-08)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v3.0.1...v3.1.0)

* Transactions - Implement MCL Next/Previous pagination. Refs UIF-342.
* Allow user to add multiple funds to a group from group view. Refs UIF-339.
* Allow user to remove Fund from Fund group. Refs UIF-340.
* Fiscal year is empty after adding funds to new group. Refs UIF-345.
* Tech debt: reducing code smells, usage of consts and resources from stripes-acq. Refs UIF-346.
* Allow user to base encumbrance on "Initial encumbrance" during rollover. Refs UIF-324.
* Display "Do not restrict encumbrance/expenditures" ledger toggles in ledger view. Refs UIF-348.
* Edit restrictExpenditures, restrictEncumbrance ledger toggles in create/edit form. Refs UIF-349.
* Add a return to Finance default search to app context menu dropdown. Refs UIF-350.
* Display transactions as Voided for canceled invoices. Refs UIF-316.
* Set enforce limit toggles to True by default in Rollover settings form. Refs UIF-352.
* Settings > Finance > change focus. Refs UIF-354.
* Refactor psets away from backend ".all" permissions.Refs UIF-333.
* Voided amount not displayed for voided transactions. Refs UIF-363.
* Avoid undefined backend permissions. Refs UIF-362.
* Accessibility analysis. Refs UIF-361.

## [3.0.1](https://github.com/folio-org/ui-finance/tree/v3.0.1) (2021-11-02)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v3.0.0...v3.0.1)

* Users having difficulty finding fiscal years as they don't know what to search. Refs UIF-335.

## [3.0.0](https://github.com/folio-org/ui-finance/tree/v3.0.0) (2021-10-07)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.4.2...v3.0.0)

* UI tests replacement with RTL/Jest. Refs FAT-37.
* Export combined Fund code list. Refs UIF-320.
* Add fund code as an option for allocation/transfer. Refs UIF-322.
* Add validation for special character to Fund Code and Expense class code so user can't save invalid code. Refs UIF-323.
* increment stripes to v7. Refs UIF-321.
* Groups - Implement MCL Next/Previous pagination. Refs UIF-326.
* Fiscal years Tab - Implement MCL Next/Previous pagination. Refs UIF-328.
* Funds - Implement MCL Next/Previous pagination. Refs UIF-325.
* Ledgers Tab - Implement MCL Next/Previous pagination. Refs UIF-327.
* Filter label contains extra 's'. Refs UIF-331.
* Users having difficulty finding fiscal years as they don't know what to search. Refs UIF-335.

## [2.4.2](https://github.com/folio-org/ui-finance/tree/v2.4.2) (2021-07-28)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.4.1...v2.4.2)

* The fiscal year is successfully saved with wrong date. Refs UIF-318.

## [2.4.1](https://github.com/folio-org/ui-finance/tree/v2.4.1) (2021-07-21)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.4.0...v2.4.1)

* Cannot edit budget 'actions required' field. Refs UIF-311.
* Should not display budget 'allocation date' field as it is NOT in the schema. Refs UIF-312.
* Cannot allocate or transfer cents as system considers them negative numbers. Refs UIF-314.

## [2.4.0](https://github.com/folio-org/ui-finance/tree/v2.4.0) (2021-06-18)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.3.3...v2.4.0)

* Finance app: Apply baseline shortcut keys. Refs UIF-293.
* Add help text to expense classes in settings area. Refs UIF-291.
* Acquisition units no longer restrict edit create or delete actions from action menu. Refs UIF-295.
* Implement Keyboard shortcuts modal. Refs UIF-305.
* Compile Translation Files into AST Format. Refs UIF-298.
* eslint@"^7.7.0" causes peer-dep inconsistency. Refs UIF-307.
* Fix fetching ledger groups. Refs UIF-309.
* Resizable panes. Refs UIF-299.

## [2.3.3](https://github.com/folio-org/ui-finance/tree/v2.3.3) (2021-04-21)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.3.2...v2.3.3)

* Transactions filters pane resize not working. Refs UIF-301.
* Typo in Expense class "Awaiting payment" column header. Refs UIF-300.

## [2.3.2](https://github.com/folio-org/ui-finance/tree/v2.3.2) (2021-04-07)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.3.1...v2.3.2)

* Fix collapse/expand all accordions. Refs UIF-296.
* Validations on FY, Ledger and Group. Refs UIF-292.

## [2.3.1](https://github.com/folio-org/ui-finance/tree/v2.3.1) (2021-03-18)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.3.0...v2.3.1)

* decrease "finance.budgets" interface requirement since 2.0 was not released.

## [2.3.0](https://github.com/folio-org/ui-finance/tree/v2.3.0) (2021-03-18)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.2.0...v2.3.0)

* Cannot create fiscal year. Refs UIF-290.
* Fiscal year code missing field validation. Refs UIF-289.
* Transactions: display POL or Invoice number as Hyperlink to corresponding record. Refs UIF-283.
* Limit selection of fiscal years during rollover to upcoming years. Refs UIF-286.
* Allocation: set "To" budget as budget you are viewing by default. Refs UIF-284.
* Allow only positive allocation to or from budget - Update field validation. Refs UIF-280.
* Add label to transaction type "Rollover transfer". Refs UIF-282.
* Allow user to intentionally reset budget allowances during rollover. Refs UIF-275.
* Manually release encumbrances. Refs UIF-271.
* Add Rollover confirmation modal so user can not start roll by mistake. Refs UIF-279.
* Update Fiscal year view to include more summary information. Refs UIF-262.
* Display fiscal year rollover error message and log file. Refs UIF-238.
* Update group view to include more summary information. Refs UIF-264.
* Update ledger view to include more summary information. Refs UIF-263.
* Update Budget detail view to include more summary information. Refs UIF-261.
* Start Rollover process with some stub data. Refs UIF-171
* "Based on" fields not required for encumbrance rollover when not in use. Refs UIF-274
* Add personal data disclosure form. Refs UIF-272.
* Display fiscal year rollover progress. Refs UIF-237
* Close all current budgets when executing fiscal year rollover. Refs UIF-175
* Set encumbrance detail for fiscal year rollover. Refs UIF-170
* Set Fiscal year detail during fiscal year rollover. Refs UIF-254
* Set Fund detail for fiscal year rollover. Refs UIF-169
* Begin fiscal year rollover for a Ledger. Refs UIF-168.
* Error message: Ledger name already in use. Refs UIF-256.
* Error message: Ledger code already in use. Refs UIF-255.
* Missing Expense classes permission. Refs UIF-265
* Group view - Display encumbered and awaiting payment amount in "Current expense classes" table. Refs UIF-259

## [2.2.0](https://github.com/folio-org/ui-finance/tree/v2.2.0) (2020-10-09)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.1.2...v2.2.0)

* Fund view - Display encumbered and awaiting payment amount in "Current expense classes" table. Refs UIF-258
* Update edit form inactive fields - Budget. Refs UIF-252
* Display error message when transfer is restricted. Refs UIF-242
* Display error message when attempting delete a Budget with Expense Classes. Refs UIF-244
* Update view pane to display null as hyphen - Finance. Refs UIF-251
* Migrate Transaction form to react-final-form. Refs UIF-250
* Migrate Group form to react-final-form. Refs UIF-248
* Migrate Ledger form to react-final-form. Refs UIF-249
* Migrate "Create budget" form to react-final-form. Refs UIF-247
* Display and filter by expense class in transaction view. Refs UIF-241
* Display "Net transfers" amount on Ledger view. Refs UIF-236
* Allowable expenditure/encumbrance display as 0% when not set. Refs UIF-240
* Edit fiscal year - Form elements must have labels. Refs UIF-197
* Display expense classes on Fund record view. Refs UIF-230
* Display expense class information on Group view. Refs UIF-227
* Display "Net transfers" amount on budget view. Refs UIF-215
* New icons for Allocate and Transfer. Refs UIF-185

### Stories
* [UIF-212](https://issues.folio.org/browse/UINV-212) Add expense classes to a budget
* [UIF-214](https://issues.folio.org/browse/UINV-214) Display expense class information on budget view
* [UIF-211](https://issues.folio.org/browse/UINV-211) CRUD expense classes in Finance settings
* [UIF-229](https://issues.folio.org/browse/UINV-229) Change mouse cursor for non-sortable columns
* [UIF-228](https://issues.folio.org/browse/UINV-228) Increase granularity of finance app permissions

### Bug fixes
* [UIF-196](https://issues.folio.org/browse/UIF-196) Edit fiscal year - Certain ARIA roles must be contained by particular parents
* [UIF-193](https://issues.folio.org/browse/UIF-193) Edit ledger - Certain ARIA roles must be contained by particular parents

## [2.1.2](https://github.com/folio-org/ui-finance/tree/v2.1.2) (2020-07-01)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.1.1...v2.1.2)

### Stories
* [UISACQCOMP-3](https://issues.folio.org/browse/UISACQCOMP-3) Handle import of stripes-acq-components to modules and platform

### Bug fixes
* [UIF-232](https://issues.folio.org/browse/UIF-232) Transfer 'from' field is required but has no indicator in UI
* [UIF-231](https://issues.folio.org/browse/UIF-231) Fiscal year Allocated total is calculated incorrectly

## [2.1.1](https://github.com/folio-org/ui-finance/tree/v2.1.1) (2020-06-12)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.1.0...v2.1.1)

* fixed tests and missing translation;

## [2.1.0](https://github.com/folio-org/ui-finance/tree/v2.1.0) (2020-06-12)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.0.1...v2.1.0)

### Stories
* [UINV-154](https://issues.folio.org/browse/UINV-154) Add separate permissions for creating Allocation and transfer
* [UIF-217](https://issues.folio.org/browse/UIF-217) Support Pending payment transaction details
* [UIF-223](https://issues.folio.org/browse/UIF-223) Change "allowable" default percentage on the Create budget screen
* [UIF-222](https://issues.folio.org/browse/UIF-222) Change "allowable" field labels on the Create budget screen
* [UIF-218](https://issues.folio.org/browse/UIF-218) Finance app: Update to Stripes v4
* [UIREC-42](https://issues.folio.org/browse/UIREC-42) Filter Titles by Acq unit
* [UIF-153](https://issues.folio.org/browse/UIF-153) Display appropriate error message when transaction is blocked by Allow to or from Fund setting
* [UIF-208](https://issues.folio.org/browse/UIF-208) Display transaction amounts that subtract from the budget in '()' and no negative numbers
* [UIF-202](https://issues.folio.org/browse/UIF-202) Update the sort options for a fund's transaction list
* [UIF-209](https://issues.folio.org/browse/UIF-209) View transactions from Fund
* [UIF-204](https://issues.folio.org/browse/UIF-204) Ability to sort Fund columns on the Group details view
* [UINV-184](https://issues.folio.org/browse/UINV-184) Hotlink 'Source' in transaction view
* [UINV-138](https://issues.folio.org/browse/UINV-138) Align actions icons in table to right hand side of view pane(s)
* [UIF-201](https://issues.folio.org/browse/UIF-201) Select active status by default when creating financial records

### Bug fixes
* [UIF-226](https://issues.folio.org/browse/UIF-226) Transaction currency not shown in system currency in transaction view
* [UINV-152](https://issues.folio.org/browse/UINV-152) Payment transaction not hyperlink to invoice when generated by invoice level adjustment
* [UIF-221](https://issues.folio.org/browse/UIF-221) Fund search should be retained after returning from budget details
* [UIF-220](https://issues.folio.org/browse/UIF-220) Fund and Groups result list "load more" buttons not working properly
* [UIF-188](https://issues.folio.org/browse/UIF-188) Error message not helpful when saving group
* [UIF-210](https://issues.folio.org/browse/UIF-210) View transactions glitch shows transactions from different budget
* [UIORGS-151](https://issues.folio.org/browse/UIORGS-151) Organizations is not using the same Expand/Collapse as implemented in Q4 2019
* [UIF-203](https://issues.folio.org/browse/UIF-203) On ledger detail view, funds associated with the ledger not in alpha order

## [2.0.1](https://github.com/folio-org/ui-finance/tree/v2.0.1) (2020-04-03)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v2.0.0...v2.0.1)

### Bug fixes
* [UIF-190](https://issues.folio.org/browse/UIF-190) Fiscal year record displaying all Ledgers
* [UIF-187](https://issues.folio.org/browse/UIF-187) Can not delete a budget
* [UIF-186](https://issues.folio.org/browse/UIF-186) Ledger groups table not scrolling - showing a maximum of 10 groups

## [2.0.0](https://github.com/folio-org/ui-finance/tree/v2.0.0) (2020-03-13)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v1.7.1...v2.0.0)

* bump the @folio/stripes peer to v3.0.0

### Stories
* [UIF-177](https://issues.folio.org/browse/UIF-177) Update transaction view
* [UIF-128](https://issues.folio.org/browse/UIF-128) Filter Finance transaction records by tags
* [UIF-182](https://issues.folio.org/browse/UIF-182) TECH-DEBT refactor Funds list to not use SearchAndSort
* [UIF-179](https://issues.folio.org/browse/UIF-179) Move record action buttons into "Action" button UX pattern
* [UIF-176](https://issues.folio.org/browse/UIF-176) TECH-DEBT refactor Ledgers list to not use SearchAndSort
* [UIF-178](https://issues.folio.org/browse/UIF-178) TECH-DEBT refactor Groups list to not use SearchAndSort
* [UIF-162](https://issues.folio.org/browse/UIF-162) Display over encumbered and over expended values on Budget view
* [UIF-156](https://issues.folio.org/browse/UIF-156) TECH-DEBT refactor Fiscal years list to not use SearchAndSort
* [UIF-158](https://issues.folio.org/browse/UIF-158) Update create planned budget
* [UIF-161](https://issues.folio.org/browse/UIF-161) Not displaying active budgets for fiscal years other than current fiscal year
* [UIF-172](https://issues.folio.org/browse/UIF-172) Update settings permission label
* [UIF-157](https://issues.folio.org/browse/UIF-157) Update create current budget
* [UIF-149](https://issues.folio.org/browse/UIF-149) display Ledger and related totals for that year
* [UIF-148](https://issues.folio.org/browse/UIF-148) Update Fiscal year record view to display group and related totals for that year

### Bug fixes
* [UIF-165](https://issues.folio.org/browse/UIF-164) Search option “All” for ledger does not include Code
* [UIF-160](https://issues.folio.org/browse/UIF-160) Default results display on the start page for ledgers (inconsistency with fiscal year/group/fund)
* [UIF-163](https://issues.folio.org/browse/UIF-163) Search option “All” for fund groups does not include Code
* [UIF-164](https://issues.folio.org/browse/UIF-164) Search option “All” for fiscal year does not include Code

## [1.7.1](https://github.com/folio-org/ui-finance/tree/v1.7.1) (2019-12-18)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.7.0...v1.7.1)

### Bug fixes
* [UIF-154](https://issues.folio.org/browse/UIF-154) Displaying multiple current budgets at once
* [UIF-159](https://issues.folio.org/browse/UIF-159) Ledger not displaying correct totals


## [1.7.0](https://github.com/folio-org/ui-finance/tree/v1.7.0) (2019-12-04)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v1.6.0...v1.7.0)

### Stories
* [UIF-119](https://issues.folio.org/browse/UIF-119) Update the success toast when budget is created/updated
* [UIF-145](https://issues.folio.org/browse/UIF-145) Update Fiscal year record view to display fund and related totals for that year
* [UIF-150](https://issues.folio.org/browse/UIF-150) Update Ledger record view to display related fund totals for that year
* [UIF-146](https://issues.folio.org/browse/UIF-146) Update Ledger record view to display related group totals for that year
* [UIF-147](https://issues.folio.org/browse/UIF-147) Update group record view to display related fund totals for the current fiscal year
* [UIF-107](https://issues.folio.org/browse/UIF-107) Add funds to a Group and calculate the summaries
* [UIF-141](https://issues.folio.org/browse/UIF-141) Ledger view: Fiscal year
* [UIF-127](https://issues.folio.org/browse/UIF-127) Filter Finance fund records by tags
* [UIF-105](https://issues.folio.org/browse/UIF-105) Finance settings: fund type
* [UIF-18](https://issues.folio.org/browse/UIF-18) Assign tags to Finance Fund Records
* [UIF-124](https://issues.folio.org/browse/UIF-124) Create new fiscal year during ledger creation
* [UIF-135](https://issues.folio.org/browse/UIF-135) Fiscal year Code validation message
* [UIF-123](https://issues.folio.org/browse/UIF-123) Select (link) fiscal year during ledger creation
* [UIF-129](https://issues.folio.org/browse/UIF-129) Add "inactive" status support to the Budget view/edit screen
* [UIF-34](https://issues.folio.org/browse/UIF-34) Do not allow the duplication of Fund codes
* [UIF-102](https://issues.folio.org/browse/UIF-102) use finance business logic module
* [UIF-36](https://issues.folio.org/browse/UIF-36) Need confirmation popup when “Removing” records in Finance app - Match "vendor record" delete button
* [UIF-72](https://issues.folio.org/browse/UIF-72) Ability to assign Acquisition unit(s) to Fund records
* [UIF-98](https://issues.folio.org/browse/UIF-98) Ability to assign Group(s) to Fund records
* [UIF-48](https://issues.folio.org/browse/UIF-48) Add assigned Ledger detail as column in search and filter result list for Funds
* [UIF-35](https://issues.folio.org/browse/UIF-35) Sort Funds alphabetically by default
* [UIF-112](https://issues.folio.org/browse/UIF-112) Search and Filter: Search and Filter "Fund"
* [UIF-94](https://issues.folio.org/browse/UIF-94) Display Fund information on group record view
* [UIF-110](https://issues.folio.org/browse/UIF-110) Search and Filter: Search and Filter "Fiscal year"
* [UIF-111](https://issues.folio.org/browse/UIF-111) Search and Filter: Search and Filter "Group"
* [UIF-55](https://issues.folio.org/browse/UIF-55) Search and Filter: Search and Filter Ledgers
* [UIF-76](https://issues.folio.org/browse/UIF-76) Display group info on ledger record view pane
* [UIF-79](https://issues.folio.org/browse/UIF-79) CRUD Transfer
* [UIF-101](https://issues.folio.org/browse/UIF-101) View transaction details
* [UIF-80](https://issues.folio.org/browse/UIF-80) CRUD Allocation
* [UIF-75](https://issues.folio.org/browse/UIF-75) Display fund info on ledger record view
* [UIF-96](https://issues.folio.org/browse/UIF-96) View transactions
* [UIF-95](https://issues.folio.org/browse/UIF-95) Display budget info on Fund record view
* [UIF-84](https://issues.folio.org/browse/UIF-84) Update Ledger record view
* [UIF-91](https://issues.folio.org/browse/UIF-91) Update create/edit Fund record form
* [UIF-90](https://issues.folio.org/browse/UIF-90) Update Fiscal year record view
* [UIF-88](https://issues.folio.org/browse/UIF-88) Create and edit Group records
* [UIF-89](https://issues.folio.org/browse/UIF-89) Delete Group records
* [UIF-99](https://issues.folio.org/browse/UIF-99) Update create Budget workflow
* [UIF-97](https://issues.folio.org/browse/UIF-97) Update edit Budget form
* [UIF-87](https://issues.folio.org/browse/UIF-87) View fund group record details
* [UIF-92](https://issues.folio.org/browse/UIF-92) Update Budget record view
* [UIF-85](https://issues.folio.org/browse/UIF-85) Update Fund record view
* [UIF-86](https://issues.folio.org/browse/UIF-86) Update three pane layout for finance app

### Bug fixes
* [UIF-142](https://issues.folio.org/browse/UIF-142) Cannot edit Fund
* [UIF-143](https://issues.folio.org/browse/UIF-143) Allowable encumbrance and expenditure not showing as a percentage
* [UIF-144](https://issues.folio.org/browse/UIF-144) Ledger displaying duplicate groups and groups that have no relation through a Fund to the ledger
* [UIF-138](https://issues.folio.org/browse/UIF-138) Fund: connected ledger and type not displaying in view pane
* [UIF-131](https://issues.folio.org/browse/UIF-131) Finance perms: Label update
* [UIF-132](https://issues.folio.org/browse/UIF-132) Cannot access create new fund after selecting a fund
* [UIF-114](https://issues.folio.org/browse/UIF-114) Can transfer or allocate money from a budget to that same budget
* [UIF-120](https://issues.folio.org/browse/UIF-120) Cannot create a new ledger or edit an existing ledger
* [UIF-113](https://issues.folio.org/browse/UIF-113) Can not exit budget view after leaving Transaction area
* [UIF-118](https://issues.folio.org/browse/UIF-118) Mixup between Abbreviation and Code terms in finance record search results & screens
* [UIF-121](https://issues.folio.org/browse/UIF-121) Cannot create a new fiscal year or edit an existing fiscal year
* [UIF-6](https://issues.folio.org/browse/UIF-6) Headers on the 4 Finance homepages don't change
* [STCOM-590](https://issues.folio.org/browse/STCOM-590) ACQ Apps: MCL column width updates
* [UIF-106](https://issues.folio.org/browse/UIF-106) Navigation between the finance record types in search/filter pane does not work

## [1.6.0](https://github.com/folio-org/ui-finance/tree/v1.6.0) (2019-07-23)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v1.5.0...v1.6.0)

* Okapi interface `finance-storage.funds` was updated to 2.0;

## [1.5.0](https://github.com/folio-org/ui-finance/tree/v1.5.0) (2019-06-11)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v1.4.1...v1.5.0)
* [UIF-67](https://issues.folio.org/browse/UIF-67) Setting visible Finance permissions has no effect
* [UIF-66](https://issues.folio.org/browse/UIF-66) Finance schema fields and endpoints updates

## [1.4.1](https://github.com/folio-org/ui-finance/tree/v1.4.1) (2019-05-10)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v1.4.0...v1.4.1)

* bump version in package.json

## [1.4.0](https://github.com/folio-org/ui-finance/tree/v1.4.0) (2019-05-10)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v1.3.0...v1.4.0)

* UIF-64 Change Create/Update Finance buttons to `Save`.

## [1.3.0](https://github.com/folio-org/ui-finance/tree/v1.3.0) (2019-01-25)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v1.2.0...v1.3.0)

* Upgrade to stripes v2.0.0.

## [1.2.0](https://github.com/folio-org/ui-finance/tree/v1.2.0) (2018-12-06)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v1.1.0...v1.2.0)

* Fiscal year edit data. Ref: UIF-42.
* Fixed api call error in Fund and ledger. Ref: UIF-41.
* Updated fund edit and view data. Ref: UIF-40.
* Fixed ledger edit data. Ref: UIF-39.
* Added back ledger status to ledger form and ledger view, removed unused fields. Ref: UIF-10.
* Increase fund and fiscal year query limit to 200. Ref: UIF-25.
* Capitalized label firstletter. Ref: UIF-5.

## [1.1.0](https://github.com/folio-org/ui-finance/tree/v1.1.0) (2018-10-10)
[Full Changelog](https://github.com/folio-org/ui-finance/compare/v1.0.1...v1.1.0)

* Clean up Fiscal Year name in ledger view and ledger edit. Ref: UIF-8.
* Show percentage in Allowable Encumbrance and Expenditure. Ref: UIF-27.
* Budget totals Allocated, Unavailable and Available: css theming and show calculation results. Ref: UIF-28.
* Change property name "period_start and period_end" to "start_date and end_date". Ref: UIF-24;
* Added asterisk to Name label in ledger form. Ref: UIF-10.
* Added asterist to all required fields in Funds. Ref: UIF-12.
* Fixed funds date field invalid value. Ref: UIF-11.
* Updated labels for "Allowable Encumbrance Percentage" and "Allowable Expenditure Percentage". Ref: UIF-2;
* Implement tags into Ledger, Funds, Budget, Fiscal Year and. Ref: UIF-17, UIF-18, UIF-19 and UIF-20.
* Fixed column sorting. Ref: UIF-14
* Enabled disabled fields in budget view. Ref: UIF-23
* Fixed fiscal year label mis-match. Ref: UIF-15
* Fixed fund labels mismatch, moved description input at the bottom in fund form. Ref: UIF-4.
* Fixed mismatch labels and align name and code field grid. Ref: UIF-5.
* Removed fiscal year start and end date 'readonly' attribute. Ref: UIF-22.
* Fixes typo "Limit Encumbrance Percent" and "Limit Expenditure Percent". ref: UIF-13.
* Added asterisk to required field in Budget. ref: UIF-13.
* Added asterisk and required fiscal year start date and end date. ref: UIF-9.
* Remove notes helper app
* Update core platform dependencies to use `stripes v1.0.0`. UIF-29

## [1.0.1](https://github.com/folio-org/ui-vendors/tree/v1.0.1) (2018-09-17)
* Update stripes-form version. Fixes UIV-8.

## 1.0.0
* UI crud for Finance (Ledger, Budget, Fiscal Year, Fund)
* Implement SearchAndSort Filters (Ledger, Budget, Fiscal Year, Fund)
