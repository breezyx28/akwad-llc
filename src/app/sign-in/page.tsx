import { CONFIG } from 'src/config-global';
import { SignInView } from './view/sign-in-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | ${CONFIG.site.name}` };

export default function Page() {
  return <SignInView />;
}
