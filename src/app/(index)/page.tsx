'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { paths } from 'src/routes/paths';

export default function Page() {
  const { push } = useRouter();
  React.useEffect(() => {
    push(paths.dashboard.root);
  }, []);
  return <></>;
}
