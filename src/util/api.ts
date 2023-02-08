import axios, { AxiosResponse } from "axios";

export const jsonApi = function <T>(url: string, headers?: object): Promise<T> {
  return axios({
    method: "GET",
    url,
    headers,
  }).then((r: AxiosResponse<T>) => r.data);
};
