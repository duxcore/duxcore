import * as Express from "express";
import { ApiResponse } from "../types/api";

export function sendApiResponse(
  res: Express.Response,
  response: ApiResponse
): void {
  res.status(response.status ?? 200).json(response);
}
