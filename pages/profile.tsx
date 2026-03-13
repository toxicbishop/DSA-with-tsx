// Next.js page for Profile
import { ProfileView } from '../src/views/ProfileView';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

export default function Profile({ user }: { user: any }) {
  // You may want to type user more strictly
  return <ProfileView user={user} onUpdate={() => {}} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  let user = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/users/me`, {
      headers: {
        cookie: context.req.headers.cookie || '',
        'X-XSRF-TOKEN': cookies['XSRF-TOKEN'] || '',
      },
      credentials: 'include',
    });
    if (res.ok) {
      user = await res.json();
    }
  } catch (e) {
    // ignore
  }
  return {
    props: { user },
  };
};
