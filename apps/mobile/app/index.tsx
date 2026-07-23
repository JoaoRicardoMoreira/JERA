import { Redirect } from 'expo-router';

import { LoadingState } from '@/components/feedback/States';
import { AppScreen } from '@/components/layout/AppScreen';
import { useAuth } from '@/features/auth/auth-context';

export default function IndexRoute() {
  const { user, bootstrapping } = useAuth();

  if (bootstrapping) {
    return (
      <AppScreen scroll={false} contentStyle={{ flex: 1, justifyContent: 'center' }}>
        <LoadingState label="Abrindo Jera..." />
      </AppScreen>
    );
  }

  return <Redirect href={user ? '/(tabs)/dashboard' : '/(auth)/login'} />;
}
