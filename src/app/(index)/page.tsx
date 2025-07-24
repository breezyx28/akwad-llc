'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { paths } from 'src/routes/paths';

export default function Page() {
  const { push } = useRouter();
  React.useEffect(() => {
    push(paths.dashboard.root);
  }, []);
  return <></>;
}
