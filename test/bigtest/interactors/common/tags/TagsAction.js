import {
  interactor,
  text,
} from '@bigtest/interactor';

export default interactor(class TagsAction {
  count = text('[class^="badge"] [class^="label"]');
});
