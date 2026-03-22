const LOCAL_BACKEND_PORT = "8081";

const isLocalHost = (hostname) => hostname === "localhost" || hostname === "127.0.0.1";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const shouldReplaceStaleLocalUrl = (value) =>
  /^https?:\/\/(localhost|127\.0\.0\.1):5000(\/api)?\/?$/i.test(value);

const getLocalOrigin = () => {
  if (typeof window === "undefined" || !isLocalHost(window.location.hostname)) {
    return null;
  }

  return `${window.location.protocol}//${window.location.hostname}:${LOCAL_BACKEND_PORT}`;
};

export const getApiBaseUrl = () => {
  const localOrigin = getLocalOrigin();
  const configuredApiUrl = process.env.REACT_APP_API_URL?.trim();

  if (configuredApiUrl) {
    const normalizedApiUrl = trimTrailingSlash(configuredApiUrl);
    if (localOrigin && shouldReplaceStaleLocalUrl(normalizedApiUrl)) {
      return `${localOrigin}/api`;
    }

    return normalizedApiUrl;
  }

  return localOrigin ? `${localOrigin}/api` : "http://localhost:8081/api";
};

export const getApiOrigin = () => getApiBaseUrl().replace(/\/api$/, "");

export const getSocketUrl = () => {
  const localOrigin = getLocalOrigin();
  const configuredSocketUrl = process.env.REACT_APP_SOCKET_URL?.trim();

  if (configuredSocketUrl) {
    const normalizedSocketUrl = trimTrailingSlash(configuredSocketUrl);
    if (localOrigin && shouldReplaceStaleLocalUrl(normalizedSocketUrl)) {
      return localOrigin;
    }

    return normalizedSocketUrl;
  }

  return localOrigin || "http://localhost:8081";
};
