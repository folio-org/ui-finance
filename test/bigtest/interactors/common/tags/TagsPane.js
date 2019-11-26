import {
  clickable,
  collection,
  fillable,
  Interactor,
  interactor,
  isPresent,
} from '@bigtest/interactor';

@interactor class SelectedTags {
  static defaultScope = '#tagsPane [class*=multiSelectControlGroup---]';
  list = collection('[class*=multiSelectValueList---] [class*=valueChipRoot---]', {
    deleteTag: clickable('[class*=iconButton---]'),
  });

  fillTag = fillable('[class*=multiSelectInput---]');
}

export default interactor(class TagsPaneInteractor {
  static defaultScope = '#tagsPane';

  closeButton = new Interactor('#tagsPane [class*=paneHeader---] [class*=paneHeaderButtonsArea---] [class*=paneMenu---] [class*=iconButton---]');
  selectedTags = new SelectedTags();
  addTag = clickable('[class*=multiSelectOption---]');
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
