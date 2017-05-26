import qs from 'qs';
export const config = {
  insidePopState: false,
};

export function changeUrl(clientStore) {
  // Do not change the URL if we are inside a popState event.
  if (config.insidePopState) return;

  const data = clientStore.getAll();
  if (!data.selectedKind) return;

  const { selectedKind, selectedStory, customQueryParams } = data;

  const {
    goFullScreen: full,
    showDownPanel: down,
    showLeftPanel: left,
    downPanelInRight: panelRight,
  } = data.shortcutOptions;

  const {
    selectedDownPanel: downPanel,
  } = data;

  const urlObj = {
    ...customQueryParams,
    selectedKind,
    selectedStory,
    full: Number(full),
    down: Number(down),
    left: Number(left),
    panelRight: Number(panelRight),
    downPanel,
  };

  const url = `?${qs.stringify(urlObj)}`;

  const state = {
    ...urlObj,
    full,
    down,
    left,
    panelRight,
    url,
  };

  window.history.pushState(state, '', url);
}

export function updateStore(queryParams, actions) {
  const {
    selectedKind,
    selectedStory,
    full = 0,
    down = 1,
    left = 1,
    panelRight = 0,
    downPanel,
    ...customQueryParams
  } = queryParams;

  if (selectedKind) {
    actions.api.selectStory(selectedKind, selectedStory);
  }

  actions.shortcuts.setOptions({
    goFullScreen: Boolean(Number(full)),
    showDownPanel: Boolean(Number(down)),
    showLeftPanel: Boolean(Number(left)),
    downPanelInRight: Boolean(Number(panelRight)),
  });

  if (downPanel) {
    actions.ui.selectDownPanel(downPanel);
  }
  actions.api.setQueryParams(customQueryParams);
}

export function handleInitialUrl(actions, location) {
  const queryString = location.search.substring(1);
  if (!queryString || queryString === '') return;

  const parsedQs = qs.parse(queryString);
  updateStore(parsedQs, actions);
}

export default function ({ clientStore }, actions) {
  // handle initial URL
  handleInitialUrl(actions, window.location);

  // subscribe to clientStore and change the URL
  clientStore.subscribe(() => changeUrl(clientStore));
  changeUrl(clientStore);

  // handle back button
  window.onpopstate = () => {
    config.insidePopState = true;
    handleInitialUrl(actions, window.location);
    config.insidePopState = false;
  };
}
