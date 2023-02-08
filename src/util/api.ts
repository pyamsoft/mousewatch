import axios, {
  AxiosHeaders,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from "axios";

export const jsonApi = function <T>(
  url: string,
  headers?: RawAxiosRequestHeaders | AxiosHeaders
): Promise<T> {
  return axios({
    method: "GET",
    url,
    headers,
  }).then((r: AxiosResponse<T>) => r.data);
};
