import { fetchUtils } from 'react-admin';
import simpleRestProvider from "ra-data-simple-rest";
import { HttpError } from "react-admin";

export const helperRequestErrorGenerator = (errorNumber:Number, customMessage:String|undefined = undefined) => {
  let errorMessage = typeof customMessage == "string"? customMessage: "An error occurred. Please try again later or contact an administrator"
  let params = { message: errorMessage }
  switch(errorNumber){
      case 400:
          return new HttpError("Client Error", errorNumber, params)
      case 401:
          return new HttpError("Unauthorized", errorNumber, params)
      case 403:
          return new HttpError("Forbidden", errorNumber, params)
      case 500:
          return new HttpError("Server Error", errorNumber, params)
      default:
          return new HttpError(`Error ${errorNumber}`, errorNumber, params)
  }
}

const fetchJson = (url: string, options: fetchUtils.Options = {}) => {
  const customHeaders = (options.headers ||
    new Headers({
        Accept: 'application/json',
    })) as Headers;
  // add your own headers here
  customHeaders.set("Authorization", `Bearer ${localStorage.getItem('sessionToken')}`)
  options.headers = customHeaders;
  return fetchUtils.fetchJson(url, options);
}

export const dataProvider = simpleRestProvider(
  import.meta.env.VITE_SIMPLE_REST_URL,
  fetchJson
);
