import { BASE_URL } from "../constants";
import { HttpClient } from "./httpClientClass";

export const httpClient = new HttpClient(BASE_URL)