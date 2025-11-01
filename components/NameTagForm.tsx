import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import "@/app/css/NameTag.css";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";

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
  const { register, handleSubmit, control, watch, setValue } =
    useForm<NameTagContent>();
  const maxDisclosureLength = 30;
  const disclosureValue = watch("disclosure", content.disclosure ?? "");
  const isOverLimit = disclosureValue.length > maxDisclosureLength;
  const [openSnackbar, setOpenSnackbar] = useState(false);

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

  // Handler for Send to Meeting button
  const handleSendToMeeting = async () => {
    // Set sendToMeeting to true
    setValue("sendToMeeting", true);

    const updatedData: NameTagContent = {
      preferredName: watch("preferredName", content.preferredName ?? ""),
      pronouns: watch("pronouns", content.pronouns ?? ""),
      disclosure: disclosureValue,
      visible: watch("visible", content.visible ?? false),
      fullMessage: watch("fullMessage", content.fullMessage ?? ""),
      sendToMeeting: true,
    };

    // Execute the submit
    await onNameTagContentChange(updatedData);

    // Reset sendToMeeting to false
    setValue("sendToMeeting", false);

    // Show success toast
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
          <input
            className="text-input"
            id="name"
            defaultValue={content.preferredName}
            {...register("preferredName", { required: true })}
          />
        </div>
        <div className="form-field-container">
          <label htmlFor="pronouns" className="form-field-label">
            Pronouns
          </label>
          <select
            className="select-input"
            id="pronouns"
            defaultValue={content.pronouns}
            {...register("pronouns")}
          >
            <option value="">Select Pronouns</option>
            <option value="He/Him">He/Him</option>
            <option value="She/Her">She/Her</option>
            <option value="They/Them">They/Them</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-field-container">
          <label htmlFor="disclosure" className="form-field-label">
            Something About Me
          </label>
          <input
            className="text-input"
            id="disclosure"
            defaultValue={content.disclosure}
            {...register("disclosure", { maxLength: maxDisclosureLength })}
          />
          <div className={`char-count ${isOverLimit ? "warning" : ""}`}>
            <span>
              {disclosureValue.length}/{maxDisclosureLength}
            </span>
            <span className="char-limit-info">
              (Maximum characters allowed)
            </span>
            {isOverLimit && (
              <span className="warning-message">Exceeded length limit!</span>
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
        </div>
        <hr className="hr-divider-line" />
        <div className="form-field-container">
          <label htmlFor="fullMessage" className="form-field-label">
            <div>
              Disclouse Message
              <Tooltip title="This will send a message to everyone in the meeting">
                <InfoOutlinedIcon
                  fontSize="small"
                  style={{
                    cursor: "pointer",
                    color: "#888",
                    marginLeft: "0.25rem",
                  }}
                />
              </Tooltip>
            </div>
          </label>
          <div>
            <textarea
              className="text-input"
              id="fullMessage"
              rows={3}
              placeholder="Introduce yourself..."
              defaultValue={content.fullMessage}
              {...register("fullMessage")}
            />
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendToMeeting}
                  type="button"
                  size="medium"
                  sx={{ textTransform: "none" }}
                >
                  Send to Meeting
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Disclosure message is sent to the meeting Chat.
        </Alert>
      </Snackbar>
    </div>
  );
}
