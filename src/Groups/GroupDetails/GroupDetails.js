import React from 'react';
import PropTypes from 'prop-types';

import {
  Pane,
  Row,
  Col,
  ExpandAllButton,
  AccordionSet,
  Accordion,
} from '@folio/stripes/components';
import { useAccordionToggle } from '@folio/stripes-acq-components';

import {
  GROUP_ACCORDTION,
  GROUP_ACCORDTION_LABELS,
} from '../constants';
import GroupInformation from './GroupInformation';

const GroupDetails = ({
  group,
  fiscalYears,
  onClose,
}) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();

  return (
    <Pane
      id="pane-group-details"
      defaultWidth="fill"
      dismissible
      paneTitle={group.name}
      onClose={onClose}
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
          id={GROUP_ACCORDTION.information}
          label={GROUP_ACCORDTION_LABELS[GROUP_ACCORDTION.information]}
        >
          <GroupInformation
            metadata={group.metadata}
            name={group.name}
            code={group.code}
            status={group.status}
            description={group.description}
            acqUnitIds={group.acqUnitIds}
            fiscalYears={fiscalYears}
          />
        </Accordion>
      </AccordionSet>
    </Pane>
  );
};

GroupDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  fiscalYears: PropTypes.string.isRequired,
};

export default GroupDetails;
