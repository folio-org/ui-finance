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
  PaneMenu,
  Button,
  MenuSection,
} from '@folio/stripes/components';
import {
  useAccordionToggle,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  DetailsEditAction,
  DetailsRemoveAction,
} from '../../../common/DetailsActions';
import ConnectionListing from '../../ConnectionListing';
import {
  FISCAL_YEAR_ACCORDION,
  FISCAL_YEAR_ACCORDION_LABELS,
} from '../constants';
import FiscalYearInformation from './FiscalYearInformation';

const FiscalYearDetails = ({
  fiscalYear,
  funds,
  groups,
  ledgers,
  onClose,
  onEdit,
  onRemove,
  openLedger,
  openGroup,
  openFund,
}) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();
  const [isRemoveConfirmation, toggleRemoveConfirmation] = useModalToggle();

  const renderActionMenu = useCallback(
    ({ onToggle }) => (
      <MenuSection id="fiscal-year-details-actions">
        <DetailsEditAction
          perm="finance-storage.fiscal-years.item.put"
          onEdit={onEdit}
          toggleActionMenu={onToggle}
        />
        <DetailsRemoveAction
          perm="finance-storage.fiscal-years.item.delete"
          onRemove={onRemove}
          toggleActionMenu={toggleRemoveConfirmation}
          disabled={Boolean(funds.length || ledgers.length || groups.length)}
        />
      </MenuSection>
    ),
    [],
  );

  const lastMenu = (
    <PaneMenu>
      <Button
        marginBottom0
        buttonStyle="primary"
        onClick={onEdit}
      >
        <FormattedMessage id="ui-finance.actions.edit" />
      </Button>
    </PaneMenu>
  );

  return (
    <Pane
      id="pane-fiscal-year-details"
      defaultWidth="fill"
      dismissible
      paneTitle={fiscalYear.name}
      onClose={onClose}
      actionMenu={renderActionMenu}
      lastMenu={lastMenu}
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
          <ConnectionListing
            items={groups}
            currency={fiscalYear.currency}
            openItem={openGroup}
          />
        </Accordion>

        <Accordion
          id={FISCAL_YEAR_ACCORDION.fund}
          label={FISCAL_YEAR_ACCORDION_LABELS[FISCAL_YEAR_ACCORDION.fund]}
        >
          <ConnectionListing
            items={funds}
            currency={fiscalYear.currency}
            openItem={openFund}
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
  openFund: PropTypes.func.isRequired,
  openGroup: PropTypes.func.isRequired,
  openLedger: PropTypes.func.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  groups: PropTypes.arrayOf(PropTypes.object),
  ledgers: PropTypes.arrayOf(PropTypes.object),
};

FiscalYearDetails.defaultProps = {
  funds: [],
  groups: [],
  ledgers: [],
};

export default FiscalYearDetails;
