import {
  interactor,
  is,
  property,
  value,
} from '@bigtest/interactor';

@interactor
class ExpendedField {
  static defaultScope = 'input[name="expended"]';
  isDisabled = property('disabled');
}

@interactor
class AwaitingPaymentField {
  static defaultScope = 'input[name="awaitingPayment"]';
  isDisabled = property('disabled');
}

@interactor
class EncumberedField {
  static defaultScope = 'input[name="encumbered"]';
  isDisabled = property('disabled');
}

@interactor
class NameField {
  static defaultScope = 'input[name="name"]';
  isInput = is('input');
  value = value();
}

export {
  ExpendedField,
  NameField,
  EncumberedField,
  AwaitingPaymentField,
};
