/* global describe it before after Nightmare */

module.exports.test = function uiTest(uiTestCtx) {
  describe('Module test: finance:filters', function modTest() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));
    const statusFilters = ['active', 'frozen', 'inactive'];

    describe('Login > Open module "Finance" > Get hit counts > Click filters > Logout', () => {
      before((done) => {
        login(nightmare, config, done); // logs in with the default admin credentials
      });
      after((done) => {
        logout(nightmare, config, done);
      });
      it('should open module "Finance" and find version tag ', (done) => {
        nightmare
          .use(openApp(nightmare, config, done, 'finance', testVersion))
          .then(result => result);
      });
      it('should find "no results" message with no filters applied', (done) => {
        nightmare
          .wait('#paneHeaderpane-results-subtitle')
          .wait('span[class^="noResultsMessageLabel"]')
          .then(done)
          .catch(done);
      });
      statusFilters.forEach((filter) => {
        it(`should click ${filter} and find hit count`, (done) => {
          nightmare
            .wait('#accordion-toggle-button-ledgerStatus')
            .click('#accordion-toggle-button-ledgerStatus')
            .wait('#input-ledger-search')
            .type('#input-ledger-search', 0)
            .wait('#clickable-reset-all')
            .click('#clickable-reset-all')
            .wait(`#clickable-filter-ledgerStatus-${filter}`)
            .click(`#clickable-filter-ledgerStatus-${filter}`)
            .wait('#pane-results')
            .click('#clickable-reset-all')
            .wait('#paneHeaderpane-results-subtitle')
            .wait('span[class^="noResultsMessageLabel"]')
            .then(done)
            .catch(done);
        });
      });
    });
  });
};
