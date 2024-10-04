import { CONFIG } from 'src/config-global';
import { VerifyView } from './view/verify-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Verify | ${CONFIG.site.name}` };

export default function Page() {
  return <VerifyView />;
}
