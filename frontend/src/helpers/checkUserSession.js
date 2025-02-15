import Cookies from 'js-cookie';

export const getLoggedInUserId = () => {
  return Cookies.get('userId') || null;
};
