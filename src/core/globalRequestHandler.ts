import { baseUrl } from "../constants";
import { RequestHandler } from "./requestHandler";

export const globalRequestHandler = new RequestHandler(baseUrl)