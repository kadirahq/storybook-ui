import { EventEmitter } from 'events';

export default function (provider, clientStore, actions) {
  const callbacks = new EventEmitter();
  let currentKind;
  let currentStory;

  const providerApi = {
    onStory(cb) {
      callbacks.on('story', cb);
      if (currentKind && currentStory) {
        // Using a setTimeout to call the callback to make sure it's
        // not called on current event-loop. When users add callbacks
        // they usually expect it to be called in a future event loop.
        setTimeout(() => cb(currentKind, currentStory), 0);
      }
      return function stopListening() {
        callbacks.removeListener('story', cb);
      };
    },

    setStories: actions.api.setStories,
    selectStory: actions.api.selectStory,
    handleShortcut: actions.shortcuts.handleEvent,
    setQueryParams: actions.api.setQueryParams,

    setOptions(...args) {
      actions.api.setOptions(...args);
      actions.shortcuts.setOptions(...args);
    },

    getQueryParam(key) {
      const state = clientStore.getAll();
      if (state.customQueryParams) {
        return state.customQueryParams[key];
      }
      return undefined;
    },
  };

  provider.handleAPI(providerApi);

  // subscribe to redux store and trigger onStory's callback
  clientStore.subscribe(function () {
    const state = clientStore.getAll();
    if (!state.selectedKind) return;

    if (state.selectedKind === currentKind && state.selectedStory === currentStory) {
      // No change in the selected story so avoid emitting 'story'
      return;
    }

    currentKind = state.selectedKind;
    currentStory = state.selectedStory;
    callbacks.emit('story', state.selectedKind, state.selectedStory);
    // providerApi._onStoryCallback(api.selectedKind, api.selectedStory);
  });
}
