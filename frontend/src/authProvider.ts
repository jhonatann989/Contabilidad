import { AuthProvider, HttpError } from "react-admin";
import { helperRequestErrorGenerator } from "./dataProvider";

/**
 * This authProvider is only for test purposes. Don't use it in production.
 */

interface iResponse {
  status: number,
  statusText: string,
  json: Function
}

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      let response = await fetch(`${import.meta.env.VITE_SIMPLE_REST_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: new Headers({ 'Content-Type': 'application/json' })
      })
      let json = await handleResponse(response)

      localStorage.setItem("username", json.userdata.username)
      localStorage.setItem("sessionToken", json.userdata.sessionToken)
      localStorage.setItem("permissions", JSON.stringify(json.permissions))
      return Promise.resolve()
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      console.error(error)
      return Promise.reject(helperRequestErrorGenerator(400, message))
    }
  },
  logout: async () => {
    try {
      await fetch(`${import.meta.env.VITE_SIMPLE_REST_URL}/logout`, {
        method: "GET",
        headers: new Headers({ 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('sessionToken')}`
        })
      })
      localStorage.removeItem("sessionToken")
      localStorage.removeItem("username")
      localStorage.removeItem("permissions")
      return Promise.resolve()
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      return Promise.reject(helperRequestErrorGenerator(400, message))
    }
  },
  checkError: (error) => {
    const status = error.status;
    console.log("checkError", error)
    if (status === 401 || status === 403) {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('username');
      return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem("sessionToken") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => Promise.resolve(undefined),
  getIdentity: async () => {
    try {
      let response = await fetch(`${import.meta.env.VITE_SIMPLE_REST_URL}/identity`, {
        method: "GET",
        headers: new Headers({ 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('sessionToken')}`
        })
      })
      let json = await handleResponse(response)
      return Promise.resolve(json)
    } catch(error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      return Promise.reject(helperRequestErrorGenerator(400, message))
    }
  },
};

async function handleResponse(response: iResponse) {
  if (response.status < 200 || response.status >= 300) {
    throw helperRequestErrorGenerator(response.status, response.statusText);
  }
  return await response.json();
}

export default authProvider;
