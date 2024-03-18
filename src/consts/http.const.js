export const HTTP_METHOD = {
  GET: "get",
  POST: "post",
  PATCH: "patch",
  DELETE: "delete",
};

export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  // Client Error
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  // Server Error
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const HEADERS = {
  ACCEPT: "Accept",
  AUTHORIZATION: "Authorization",
  CONTENT_TYPE: "Content-Type",
};

export const AUTHORIZATION_BASIC_KEY = "Basic";
export const AUTHORIZATION_BEARER_KEY = "Bearer";
export const CONTENT_TYPE_JSON = "application/json";
export const CONTENT_TYPE_JSON_UTF8 = "application/json; charset=utf-8";
