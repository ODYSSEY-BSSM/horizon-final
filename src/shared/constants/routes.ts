export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  MY_ROADMAPS: '/my-roadmaps',
  TEAM_SPACE: '/team-space',
  SCHOOL_CONNECT: '/school-connect',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
