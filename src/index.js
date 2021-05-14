/* eslint-disable filenames/match-exported */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { AppContextMenu } from '@folio/stripes/core';
import {
  checkScope,
  CommandList,
  defaultKeyboardShortcuts,
  HasCommand,
  NavList,
  NavListItem,
  NavListSection,
} from '@folio/stripes/components';

import {
  AcqKeyboardShortcutsModal,
  useModalToggle,
} from '@folio/stripes-acq-components';

import Main from './components/Main';
import Settings from './settings';

const Finance = ({ showSettings }) => {
  const match = useRouteMatch();
  const location = useLocation();
  const [isOpen, toggleModal] = useModalToggle();
  const focusSearchField = () => {
    const el = document.getElementById('input-record-search');

    if (el) {
      el.focus();
    }
  };

  const shortcuts = [
    {
      name: 'search',
      handler: focusSearchField,
    },
    {
      name: 'openShortcutModal',
      shortcut: 'mod+alt+k',
      handler: toggleModal,
    },
  ];

  if (showSettings) {
    return (
      <Settings
        match={match}
        location={location}
      />
    );
  }

  return (
    <>
      <CommandList commands={defaultKeyboardShortcuts}>
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <AppContextMenu>
            {handleToggle => (
              <NavList>
                <NavListSection>
                  <NavListItem
                    id="keyboard-shortcuts-item"
                    onClick={() => {
                      handleToggle();
                      toggleModal();
                    }}
                  >
                    <FormattedMessage id="stripes-acq-components.appMenu.keyboardShortcuts" />
                  </NavListItem>
                </NavListSection>
              </NavList>
            )}
          </AppContextMenu>
          <Route
            path={`${match.path}`}
            render={() => <Main />}
          />
        </HasCommand>
      </CommandList>
      {isOpen && (
        <AcqKeyboardShortcutsModal
          onClose={toggleModal}
        />
      )}
    </>
  );
};

Finance.propTypes = {
  showSettings: PropTypes.bool,
};

export default Finance;
