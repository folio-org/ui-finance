import {
  clickable,
  collection,
  interactor,
  text,
} from '@bigtest/interactor';

@interactor class OptionSegmentInteractor {
  text = text();
  click = clickable();
}

export default interactor(class OptionListInteractor {
  list = collection('li', OptionSegmentInteractor);
});
