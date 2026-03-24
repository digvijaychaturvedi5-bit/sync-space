import { useEffect, useState } from "react";

const STORAGE_KEY = "syncSpaceUser";
const AUTH_CHANGE_EVENT = "syncspace-auth-change";

export function getStoredUser() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function emitAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function storeUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  emitAuthChange();
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY);
  emitAuthChange();
}

export function useStoredUser() {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener("storage", syncUser);
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
    };
  }, []);

  return user;
}
