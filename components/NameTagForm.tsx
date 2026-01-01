import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import "@/app/css/NameTag.css";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// TODO: deduplicate this with EnabledNameTagBadge
export interface NameTagContent {
  visible: boolean;
  preferredName: string;
  pronouns: string;
  disclosure: string;
  fullMessage: string;
  sendToMeeting: boolean;
}

interface NameTagProps {
  content: NameTagContent;
  onNameTagContentChange: SubmitHandler<NameTagContent>;
  onSaveButtonClick: SubmitHandler<NameTagContent>;
}

export function NameTagForm({
  content,
  onNameTagContentChange,
  onSaveButtonClick,
}: NameTagProps) {
  const { handleSubmit, control, watch, setValue } = useForm<NameTagContent>();
  const maxDisclosureLength = 30;
  const disclosureValue = watch("disclosure", content.disclosure ?? "");
  const isOverLimit = disclosureValue.length > maxDisclosureLength;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertCtx, setAlertCtx] = useState<{
    message: string;
    severity: "success" | "info";
  }>({ message: "", severity: "success" });

  // Button click handler to manually update database with specific fields
  const handleSaveButtonClick = () => {
    const updatedData = {
      preferredName: watch("preferredName", content.preferredName ?? ""),
      pronouns: watch("pronouns", content.pronouns ?? ""),
      disclosure: disclosureValue,
      visible: watch("visible", content.visible ?? false),
      fullMessage: watch("fullMessage", content.fullMessage ?? ""),
      sendToMeeting: watch("sendToMeeting", content.sendToMeeting ?? false),
    };
    onSaveButtonClick(updatedData); // Update DB with current form data
  };

  const handleSendToMeeting = async () => {
    const fullMessage = watch("fullMessage", content.fullMessage ?? "");
    if (fullMessage.trim() === "") {
      setAlertCtx({
        message: "Please type a disclosure message before sending",
        severity: "info",
      });
      setOpenSnackbar(true);
      return;
    }
    // Set sendToMeeting to true
    setValue("sendToMeeting", true);

    const updatedData: NameTagContent = {
      preferredName: watch("preferredName", content.preferredName ?? ""),
      pronouns: watch("pronouns", content.pronouns ?? ""),
      disclosure: disclosureValue,
      visible: watch("visible", content.visible ?? false),
      fullMessage: fullMessage,
      sendToMeeting: true,
    };

    // Execute the submit
    await onNameTagContentChange(updatedData);

    // Reset sendToMeeting to false
    setValue("sendToMeeting", false);

    // Show success toast
    setAlertCtx({
      message: "Message sent to the meeting chat",
      severity: "success",
    });
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="tab-container">
      <h2 className="tab-title">Name Tag</h2>

      <form onSubmit={handleSubmit(onNameTagContentChange)}>
        <div className="form-field-container">
          <label htmlFor="name" className="form-field-label">
            Preferred Name
          </label>
          <Controller
            name="preferredName"
            control={control}
            defaultValue={content.preferredName || ""}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                id="name"
                fullWidth
                className="mui-text-input"
              />
            )}
          />
        </div>
        <div className="form-field-container">
          <label htmlFor="pronouns" className="form-field-label">
            Pronouns
          </label>
          <Controller
            name="pronouns"
            control={control}
            defaultValue={content.pronouns || ""}
            render={({ field }) => (
              <Select
                {...field}
                displayEmpty
                id="pronouns"
                className="mui-select-input"
                MenuProps={{
                  disablePortal: true,
                  PaperProps: {
                    className: "mui-select-menu",
                  },
                }}
              >
                <MenuItem value="">Select Pronouns</MenuItem>
                <MenuItem value="He/Him">He/Him</MenuItem>
                <MenuItem value="She/Her">She/Her</MenuItem>
                <MenuItem value="They/Them">They/Them</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            )}
          />
        </div>
        <div className="form-field-container">
          <label htmlFor="disclosure" className="form-field-label">
            Something About Me
          </label>
          <Controller
            name="disclosure"
            control={control}
            defaultValue={content.disclosure || ""}
            rules={{ maxLength: maxDisclosureLength }}
            render={({ field }) => (
              <TextField
                {...field}
                id="disclosure"
                fullWidth
                className="mui-text-input"
                placeholder="e.g. I have a stutter; sick at home"
                inputProps={{ "data-testid": "disclosure-input" }}
              />
            )}
          />
          <div className={`char-count ${isOverLimit ? "warning" : ""}`}>
            <span>
              {disclosureValue.length}/{maxDisclosureLength}
            </span>
            <span className="char-limit-info">
              {" "}
              (Maximum characters allowed)
            </span>
            {isOverLimit && (
              <span className="warning-message"> Exceeded length limit!</span>
            )}
          </div>
        </div>
        <div className="switch-group">
          <div className="form-container">
            <div className="controller-container">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleSaveButtonClick}
                type="submit"
                size="medium"
                sx={{ textTransform: "none" }}
              >
                Save
              </Button>
              <Controller
                control={control}
                name="visible"
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) => {
                          onChange(e);
                          handleSubmit(onNameTagContentChange)();
                        }}
                        type="checkbox"
                      />
                    }
                    label="Display"
                    labelPlacement="start"
                    className="label-styling"
                  />
                )}
              />
            </div>
          </div>
          <hr className="hr-divider-line" />
          <div className="form-field-container">
            <label htmlFor="fullMessage" className="form-field-label">
              <div>
                Disclosure Message
                <Tooltip title="A longer message to educate others about what you have disclosed">
                  <InfoOutlinedIcon fontSize="small" className="info-icon" />
                </Tooltip>
              </div>
            </label>
            <Controller
              name="fullMessage"
              control={control}
              defaultValue={content.fullMessage || ""}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="fullMessage"
                  fullWidth
                  multiline
                  rows={3}
                  className="mui-text-input"
                  placeholder="Example: Stuttering is a neurodiversity and is incurable. As a person who stutters, I sometimes need extra time for responses and appreciate your patience and respect."
                  inputProps={{ "data-testid": "full-message-textarea" }}
                />
              )}
            />
            <div className="switch-group">
              <div className="form-container">
                <div className="controller-container">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleSaveButtonClick}
                    type="submit"
                    size="medium"
                    sx={{ textTransform: "none" }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendToMeeting}
                    type="button"
                    size="medium"
                    sx={{ textTransform: "none" }}
                    data-testid="send-to-meeting-button"
                  >
                    Send to Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertCtx.severity}
          sx={{ width: "100%" }}
        >
          {alertCtx.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
