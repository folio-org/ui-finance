export const rollover = {
  id: '46044d3c-de5a-43ee-b2a5-5c82d9e24e31',
  _version: 1,
  ledgerId: '133a7916-f05e-4df4-8f7f-09eb2a7076d1',
  rolloverType: 'Preview',
  fromFiscalYearId: '0bb73cfd-9251-44ce-a7de-3ef16875ba6a',
  toFiscalYearId: '7a4c4d30-3b63-4102-8e2d-3ee5792d7d02',
  restrictEncumbrance: true,
  restrictExpenditures: true,
  needCloseBudgets: true,
  budgetsRollover: [
    {
      rolloverAllocation: true,
      rolloverAvailable: false,
      setAllowances: true,
      adjustAllocation: 1,
      addAvailableTo: 'Available',
      allowableEncumbrance: 1,
      allowableExpenditure: 3,
    },
    {
      fundTypeId: '0f5f819e-0690-4c20-ad8d-cc23a6ecc585',
      rolloverAllocation: false,
      rolloverAvailable: true,
      setAllowances: false,
      adjustAllocation: 2,
      addAvailableTo: 'Available',
    },
    {
      fundTypeId: 'c93373df-e7ec-4d31-b200-719736610d89',
      rolloverAllocation: false,
      rolloverAvailable: true,
      setAllowances: true,
      adjustAllocation: 3,
      addAvailableTo: 'Available',
      allowableEncumbrance: 4,
      allowableExpenditure: 2,
    },
    {
      fundTypeId: 'addac225-947b-41b6-b80a-4c0b79261747',
      rolloverAllocation: true,
      rolloverAvailable: false,
      setAllowances: false,
      adjustAllocation: 4,
      addAvailableTo: 'Available',
    },
  ],
  encumbrancesRollover: [
    {
      orderType: 'Ongoing',
      basedOn: 'Expended',
      increaseBy: 1,
    },
    {
      orderType: 'Ongoing-Subscription',
      basedOn: 'Remaining',
      increaseBy: 3,
    },
    {
      orderType: 'One-time',
      basedOn: 'InitialAmount',
      increaseBy: 2,
    },
  ],
  metadata: {
    createdDate: '2023-02-08T09:50:45.869+00:00',
    createdByUserId: '789db907-bd88-545d-b8cd-412f2eac7789',
    updatedDate: '2023-02-08T09:50:45.869+00:00',
    updatedByUserId: '789db907-bd88-545d-b8cd-412f2eac7789',
  },
};
