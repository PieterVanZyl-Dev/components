// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { UnreleasedProps } from '../interfaces';

export function getSortedOptions({
  options,
  order,
}: {
  options: ReadonlyArray<UnreleasedProps.ContentDisplayOption>;
  order: ReadonlyArray<UnreleasedProps.ContentDisplayItem>;
}) {
  const optionsSet: Record<string, UnreleasedProps.ContentDisplayOption> = options.reduce(
    (currentValue, option) => ({ ...currentValue, [option.id]: option }),
    {}
  );
  return order.map(({ id }) => optionsSet[id]).filter(Boolean);
}
