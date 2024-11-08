interface NewLogActionRequest {
  userEmail?: string;
  action: string;
  metadata?: object;
}

export enum Action {
  SIGN_UP = "sign_up_success",
  SIGN_UP_FAILURE = "sign_up_failure",
  LOG_IN = "log_in_success",
  LOG_IN_FAIL = "log_in_failure",
  NAME_BADGE_ON = "name_badge_activated",
  NAME_BADGE_OFF = "name_badge_deactivated",
}

export function log(action: Action, email?: string, metadata?: object) {
  const req: NewLogActionRequest = { action };
  if (email) req.userEmail = email;
  if (metadata) req.metadata = metadata;
  fetch("/api/log", {
    method: "POST",
    body: JSON.stringify(req),
  });
}
