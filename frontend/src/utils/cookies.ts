import Cookies from 'js-cookie';

export const setCookie = (name: string, value: string, options = {}) => {
    Cookies.set(name, value, { expires: 7, ...options });
};

export const getCookie = (name: string) => {
    return Cookies.get(name);
};

export const removeCookie = (name: string) => {
    Cookies.remove(name);
};
