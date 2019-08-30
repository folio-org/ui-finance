import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Accordion,
  Col,
  Row,
  ExpandAllButton,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  expandAll,
  toggleSection,
} from '../../../common/utils';
import { SECTIONS_BUDGET } from '../constants';
import BudgetSummary from './BudgetSummary';
import BudgetInformation from './BudgetInformation';

const BudgetView = ({ budget, fiscalStart, fiscalEnd }) => {
  const [sections, setSections] = useState({});

  return (
    <Fragment>
      <Row end="xs">
        <Col xs={12}>
          <ExpandAllButton
            accordionStatus={sections}
            onToggle={(allSections) => expandAll(allSections, setSections)}
          />
        </Col>
      </Row>
      <AccordionSet
        accordionStatus={sections}
        onToggle={({ id }) => toggleSection(id, setSections)}
      >
        <Accordion
          label={<FormattedMessage id="ui-finance.budget.summary.title" />}
          id={SECTIONS_BUDGET.SUMMARY}
        >
          {budget.metadata && <ViewMetaData metadata={budget.metadata} />}
          <BudgetSummary
            budget={budget}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-finance.budget.information.title" />}
          id={SECTIONS_BUDGET.INFORMATION}
        >
          <BudgetInformation
            budget={budget}
            fiscalEnd={fiscalEnd}
            fiscalStart={fiscalStart}
          />
        </Accordion>
      </AccordionSet>
    </Fragment>
  );
};

BudgetView.propTypes = {
  budget: PropTypes.object,
  fiscalStart: PropTypes.string,
  fiscalEnd: PropTypes.string,
};

BudgetView.defaultProps = {
  budget: {},
  fiscalStart: '',
  fiscalEnd: '',
};

export default BudgetView;
