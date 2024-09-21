import { CONFIG } from 'src/config-global';
import { CenteredSignInView } from './view/centered-sign-in-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | Layout centered - ${CONFIG.site.name}` };

export default function Page() {
  return <CenteredSignInView />;
}
