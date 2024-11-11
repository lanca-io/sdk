import { baseUrl } from "../constants";
import { HttpClient } from "./httpClientClass";

export const httpClient = new HttpClient(baseUrl)