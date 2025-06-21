import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
  const { register, handleSubmit, control, watch } = useForm<NameTagContent>();
  const maxDisclosureLength = 30;
  const disclosureValue = watch("disclosure", content.disclosure ?? "");
  const isOverLimit = disclosureValue.length > maxDisclosureLength;
  const bottom_padding = 12;

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

  return (
    <div className="tab-container">
      <h2 className="tab-title">Name Tag</h2>

      <form onSubmit={handleSubmit(onNameTagContentChange)}>
        <div style={{ paddingBottom: bottom_padding }}>
          <label htmlFor="name">Preferred Name</label>
          <input
            className="text-input"
            id="name"
            defaultValue={content.preferredName}
            {...register("preferredName", { required: true })}
          />
        </div>
        <div style={{ paddingBottom: bottom_padding + 5 }}>
          <label htmlFor="pronouns">Pronouns</label>
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
        <div style={{ paddingBottom: bottom_padding }}>
          <label htmlFor="disclosure">Something About Me</label>
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
                    label="Display Name Tag"
                    labelPlacement="start"
                    className="label-styling"
                  />
                )}
              />
            </div>
          </div>
          <div className="form-container">
            <div className="controller-container">
              <Controller
                control={control}
                name="sendToMeeting"
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={onChange}
                        type="checkbox"
                        onClick={(e) => {
                          onChange(e);
                          handleSubmit(onNameTagContentChange)();
                        }}
                      />
                    }
                    label={
                      <div>
                        Send Disclosure Message
                        <Tooltip title="This will send a message to everyone in the meeting">
                          <InfoOutlinedIcon fontSize="small" style={{ cursor: "pointer", color: "#888" }} />
                        </Tooltip>
                      </div>
                    }
                    labelPlacement="start"
                    className="label-styling"
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div style={{ paddingBottom: bottom_padding }}>
          <textarea
            className="text-input"
            id="fullMessage"
            rows={3}
            placeholder="Introduce yourself..."
            defaultValue={content.fullMessage}
            {...register("fullMessage")}
          />
        </div>

        
        <div>
          {/* Add the Button here to manually trigger DB update */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveButtonClick} // Handle click to update DB
            type="submit"
          >
            Save Name Tag
          </Button>
        </div>
        <div></div>
      </form>
    </div>
  );
}
