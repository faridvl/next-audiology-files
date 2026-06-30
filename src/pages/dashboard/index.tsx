import { GetServerSidePropsContext } from 'next';
import { CookiesManager } from '@/shared/utils/cookies-manager';
import { routesPublic } from '@/shared/navigation/routes';

const DashboardPage = () => null;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = CookiesManager.getAccessToken(context);
  if (!token) {
    return { redirect: { destination: routesPublic.login, permanent: false } };
  }
  return { redirect: { destination: '/patients', permanent: false } };
}

export default DashboardPage;