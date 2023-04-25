// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DrawerItem } from '../drawer/interfaces';

const storageKey = Symbol.for('awsui-plugin-api');

export type DrawerConfig = Omit<DrawerItem, 'content'> & {
  mountContent: (container: HTMLElement) => void;
  unmountContent: (container: HTMLElement) => void;
};
type Listener = (drawers: Array<DrawerConfig>) => void;

interface AwsuiPluginApiPublic {
  registerDrawer(config: DrawerConfig): void;
}
interface AwsuiPluginApiInternal {
  registerAppLayout(listener: Listener): void;
}

interface AwsuiApi {
  awsuiPlugins: AwsuiPluginApiPublic;
  awsuiPluginsInternal: AwsuiPluginApiInternal;
}

interface WindowWithApi extends Window {
  [storageKey]: AwsuiApi;
}

function findUpApi(currentWindow: WindowWithApi): AwsuiApi | undefined {
  try {
    if (currentWindow[storageKey]) {
      return currentWindow[storageKey];
    }

    if (!currentWindow || currentWindow.parent === currentWindow) {
      // When the window has no more parents, it references itself
      return undefined;
    }

    return findUpApi(currentWindow.parent as WindowWithApi);
  } catch (ex) {
    // Most likely a cross-origin access error
    return undefined;
  }
}

function loadApi() {
  if (typeof window === 'undefined') {
    return createApi();
  }
  const win = window as unknown as WindowWithApi;
  const api = findUpApi(win);
  if (api) {
    return api;
  }
  win[storageKey] = createApi();
  return win[storageKey];
}

export const { awsuiPlugins, awsuiPluginsInternal } = loadApi();

function createApi(): AwsuiApi {
  const drawers: Array<DrawerConfig> = [];
  let appLayout: Listener | null = null;
  let updateTimeout: ReturnType<typeof setTimeout>;

  function scheduleUpdate() {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    updateTimeout = setTimeout(() => {
      appLayout?.(drawers);
    });
  }

  return {
    awsuiPlugins: {
      registerDrawer(config) {
        drawers.push(config);
        scheduleUpdate();
      },
    },
    awsuiPluginsInternal: {
      registerAppLayout(listener) {
        appLayout = listener;
        scheduleUpdate();
      },
    },
  };
}
