import Cookies from 'js-cookie';

const getCookie = (name) => {
  return Cookies.get(name);
};

const setCookie = (name, value, days) => {
  Cookies.set(name, value, { expires: days });
};

const removeCookie = (name) => {
  Cookies.remove(name);
};

export { getCookie, setCookie, removeCookie };
