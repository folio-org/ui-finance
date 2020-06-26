import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Row,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  AccordionSet,
  Accordion,
  MenuSection,
} from '@folio/stripes/components';
import {
  useAccordionToggle,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  DetailsEditAction,
  DetailsRemoveAction,
} from '../../common/DetailsActions';
import {
  calculateTotals,
} from '../../common/utils';
import ConnectionListing from '../../components/ConnectionListing';
import {
  FISCAL_YEAR_ACCORDION,
  FISCAL_YEAR_ACCORDION_LABELS,
} from '../constants';
import FiscalYearInformation from './FiscalYearInformation';
import FiscalYearFunds from './FiscalYearFunds';
import FiscalYearGroups from './FiscalYearGroups';

const FiscalYearDetails = ({
  fiscalYear,
  funds,
  groupSummaries,
  ledgers,
  onClose,
  onEdit,
  onRemove,
  openLedger,
}) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();
  const [isRemoveConfirmation, toggleRemoveConfirmation] = useModalToggle();

  const renderActionMenu = useCallback(
    ({ onToggle }) => (
      <MenuSection id="fiscal-year-details-actions">
        <DetailsEditAction
          perm="ui-finance.fiscal-year.edit"
          onEdit={onEdit}
          toggleActionMenu={onToggle}
        />
        <DetailsRemoveAction
          perm="ui-finance.fiscal-year.delete"
          onRemove={toggleRemoveConfirmation}
          toggleActionMenu={onToggle}
        />
      </MenuSection>
    ),
    [onEdit, toggleRemoveConfirmation],
  );

  const fiscalYearTotals = calculateTotals(ledgers);

  return (
    <Pane
      id="pane-fiscal-year-details"
      defaultWidth="fill"
      dismissible
      paneTitle={fiscalYear.name}
      onClose={onClose}
      actionMenu={renderActionMenu}
    >
      <Row end="xs">
        <Col xs={12}>
          <ExpandAllButton
            accordionStatus={sections}
            onToggle={expandAll}
          />
        </Col>
      </Row>

      <AccordionSet
        accordionStatus={sections}
        onToggle={toggleSection}
      >
        <Accordion
          id={FISCAL_YEAR_ACCORDION.information}
          label={FISCAL_YEAR_ACCORDION_LABELS[FISCAL_YEAR_ACCORDION.information]}
        >
          <FiscalYearInformation
            acqUnitIds={fiscalYear.acqUnitIds}
            code={fiscalYear.code}
            description={fiscalYear.description}
            metadata={fiscalYear.metadata}
            name={fiscalYear.name}
            periodEnd={fiscalYear.periodEnd}
            periodStart={fiscalYear.periodStart}
            currency={fiscalYear.currency}
            allocated={fiscalYearTotals.allocated}
            available={fiscalYearTotals.available}
            unavailable={fiscalYearTotals.unavailable}
          />
        </Accordion>

        <Accordion
          id={FISCAL_YEAR_ACCORDION.ledger}
          label={FISCAL_YEAR_ACCORDION_LABELS[FISCAL_YEAR_ACCORDION.ledger]}
        >
          <ConnectionListing
            items={ledgers}
            currency={fiscalYear.currency}
            openItem={openLedger}
          />
        </Accordion>

        <Accordion
          id={FISCAL_YEAR_ACCORDION.group}
          label={FISCAL_YEAR_ACCORDION_LABELS[FISCAL_YEAR_ACCORDION.group]}
        >
          <FiscalYearGroups
            fiscalYear={fiscalYear}
            groupSummaries={groupSummaries}
          />
        </Accordion>

        <Accordion
          id={FISCAL_YEAR_ACCORDION.fund}
          label={FISCAL_YEAR_ACCORDION_LABELS[FISCAL_YEAR_ACCORDION.fund]}
        >
          <FiscalYearFunds
            currency={fiscalYear.currency}
            fiscalYearId={fiscalYear.id}
            funds={funds}
          />
        </Accordion>
      </AccordionSet>

      {isRemoveConfirmation && (
        <ConfirmationModal
          id="fiscal-year-remove-confirmation"
          confirmLabel={<FormattedMessage id="ui-finance.actions.remove.confirm" />}
          heading={<FormattedMessage id="ui-finance.fiscalYear.actions.remove.heading" />}
          message={<FormattedMessage id="ui-finance.fiscalYear.actions.remove.message" />}
          onCancel={toggleRemoveConfirmation}
          onConfirm={onRemove}
          open
        />
      )}
    </Pane>
  );
};

FiscalYearDetails.propTypes = {
  fiscalYear: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  openLedger: PropTypes.func.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  groupSummaries: PropTypes.arrayOf(PropTypes.object),
  ledgers: PropTypes.arrayOf(PropTypes.object),
};

FiscalYearDetails.defaultProps = {
  funds: [],
  ledgers: [],
};

export default FiscalYearDetails;
