import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import {
  Pane,
  Button,
  Select,
  Label,
  Loading,
  Row,
  Col,
} from '@folio/stripes/components';
import { exportCsv } from '@folio/stripes/util';
import { useShowCallout } from '@folio/stripes-acq-components';

import { useFiscalYearOptions } from './useFiscalYearOptions';
import { useExportFund } from './useExportFund';
import css from './ExportFundSettings.css';
import { EXPORT_FUND_FIELDS } from './constants';

const ExportFundSettings = () => {
  const showCallout = useShowCallout();
  const [fiscalYearId, setFiscalYearId] = useState();
  const { fiscalYearOptions, isLoading: isFYLoading } = useFiscalYearOptions();

  const { fetchExportFund } = useExportFund(fiscalYearId);

  const onChangeFY = (e) => {
    setFiscalYearId(e.target.value);
  };

  const onExportFund = async () => {
    const { data: exportFund, isError } = await fetchExportFund();

    if (isError) {
      return showCallout({
        messageId: 'ui-finance.fund.actions.load.error',
        type: 'error',
      });
    }

    const filename = `fund-codes-export-${moment().format('YYYY-MM-DD-hh:mm')}`;

    await exportCsv(
      [EXPORT_FUND_FIELDS, ...(exportFund?.fundCodeVsExpClassesTypes || [])],
      {
        header: false,
        filename,
      },
    );

    return showCallout({
      messageId: 'ui-finance.settings.exportFund.success',
      type: 'success',
    });
  };

  return (
    <Pane
      defaultWidth="fill"
      id="pane-export-fund-settings"
      paneTitle={<FormattedMessage id="ui-finance.settings.exportFund.title" />}
    >
      <div className={css.helperText}>
        <FormattedMessage id="ui-finance.settings.exportFund.helperText" />
      </div>
      <Row>
        <Col xs={3}>
          {!isFYLoading
            ? (
              <Select
                dataOptions={[{ label: '' }, ...fiscalYearOptions]}
                onChange={onChangeFY}
                label={<FormattedMessage id="ui-finance.fiscalyear" />}
                required
              />
            )
            : (
              <>
                <Label required><FormattedMessage id="ui-finance.fiscalyear" /></Label>
                <Loading />
              </>
            )}
        </Col>
      </Row>

      <Button
        buttonStyle="primary"
        onClick={onExportFund}
        disabled={!fiscalYearId}
        data-testid="export-fund-button"
      >
        <FormattedMessage id="ui-finance.settings.button.export" />
      </Button>
    </Pane>
  );
};

export default ExportFundSettings;
