// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import { DrawerConfig } from './plugins/internal';

interface RuntimeContentWrapperProps {
  mountContent: DrawerConfig['mountContent'];
  unmountContent: DrawerConfig['unmountContent'];
}

export function RuntimeContentWrapper({ mountContent, unmountContent }: RuntimeContentWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current!;
    mountContent(container);
    return () => unmountContent(container);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}></div>;
}
