import { AuthCenteredLayout } from 'src/layouts/auth-centered';
import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <AuthCenteredLayout
        sx={{
          opacity: 1,
          backgroundImage:
            'linear-gradient(180deg, rgba(28, 37, 46, 0.06) 0%, rgba(255, 255, 255, 0.06) 100%)',
        }}
      >
        {children}
      </AuthCenteredLayout>
    </GuestGuard>
  );
}
