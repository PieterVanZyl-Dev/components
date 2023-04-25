// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import HelpPanel from '~components/help-panel';
import awsuiPlugins from '~components/app-layout/plugins';

function Content() {
  useEffect(() => {
    console.log('mounted');
    return () => console.log('unmounted');
  }, []);
  return <HelpPanel header={<h2>Security</h2>}>I am runtime drawer</HelpPanel>;
}

awsuiPlugins.registerDrawer({
  id: 'security',

  ariaLabels: {
    closeButton: 'Security close button',
    content: 'Security drawer content',
    triggerButton: 'Security trigger button',
    resizeHandle: 'Security resize handle',
  },

  trigger: {
    iconName: 'security',
  },

  resizable: true,
  size: 320,

  onResize: newSize => {
    // await moduleContext.sendMessage(appMessageTypes.setChatPanelSize.create({
    //   to: appModuleId,
    //   payload: { newSize },
    // }));
    console.log('resize', newSize);
  },

  mountContent: container => {
    ReactDOM.render(<Content />, container);
  },
  unmountContent: container => unmountComponentAtNode(container),
});
