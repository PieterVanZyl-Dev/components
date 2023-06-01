// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { CodeEditor, CodeEditorProps, Textarea } from '~components';
import { i18nStrings as codeEditorI18nStrings } from '../../code-editor/base-props';

export function SettingsEditor<S extends object>({
  settings,
  onChange,
  readonly,
}: {
  settings: S;
  onChange(settings: S): void;
  readonly?: boolean;
}) {
  const [ace, setAce] = useState<CodeEditorProps['ace']>();
  const [propsStr, setPropsStr] = useState(JSON.stringify(settings, null, 2));
  const [aceLoading, setAceLoading] = useState(true);
  useEffect(() => {
    import('ace-builds').then(ace => {
      ace.config.set('basePath', './ace/');
      ace.config.set('useStrictCSP', true);
      setAce(ace);
      setAceLoading(false);
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        onChange(JSON.parse(propsStr));
      } catch {
        // ignore
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsStr]);

  if (readonly) {
    return <Textarea value={propsStr} readOnly={true} rows={propsStr.split('\n').length} />;
  }

  return (
    <CodeEditor
      ace={ace}
      value={propsStr}
      language="json"
      onDelayedChange={event => setPropsStr(event.detail.value)}
      onPreferencesChange={() => {}}
      loading={aceLoading}
      i18nStrings={codeEditorI18nStrings}
    />
  );
}
