import {
  attribute,
  interactor,
  is,
  property,
} from '@bigtest/interactor';

export default interactor(class ButtonInteractor {
  isButton = is('button');
  isDisabled = property('disabled');
  disabled = attribute('disabled');

  isPrimary = is('[class*="primary"]');
});
