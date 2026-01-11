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
  NAME_BADGE_UPDATED = "name_badge_updated",
  APP_INSTALLED = "app_installed",
  HAND_WAVE_ON = "hand_wave_activated",
  HAND_WAVE_OFF = "hand_wave_deactivated",
  HAND_WAVE_ADDED = "hand_wave_added",
  HAND_WAVE_DELETED = "hand_wave_deleted",
  DISCLOSURE_SENT = "disclosure_message_sent",
  MINDFULNESS_VIDEO_PLAYED = "mindfulness_video_played",
  AFFIRMATION_ADDED = "affirmation_added",
  AFFIRMATION_DELETED = "affirmation_deleted",
  AFFIRMATION_UPDATED = "affirmation_updated",
  ERROR = "error",
}

export function log(action: Action, email?: string, metadata?: object) {
  const req: NewLogActionRequest = { action };
  if (email) req.userEmail = email;
  if (metadata) req.metadata = metadata;
  fetch("/api/log", {
    method: "POST",
    body: JSON.stringify(req),
  }).catch((err) => {
    // Silently fail
  });
}
