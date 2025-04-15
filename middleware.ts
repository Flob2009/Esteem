import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin', // Redirige ici si non connecté
  },
});

export const config = {
  matcher: [
    '/quiz/manual/preview',
    '/quiz/manual/run',
    '/quiz/history',
    '/profile',
  ],
};