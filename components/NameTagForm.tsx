import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
  const [showToast, setShowToast] = useState(false);

  // Button click handler to manually update database with specific fields
  const handleSaveButtonClick = () => {
    const updatedData = {
      preferredName: watch("preferredName", content.preferredName ?? ""),
      pronouns: watch("pronouns", content.pronouns ?? ""),
      disclosure: disclosureValue,
      visible: watch("visible ", content.visible ?? false),
      fullMessage: watch("fullMessage", content.fullMessage ?? ""),
      sendToMeeting: watch("sendToMeeting", content.sendToMeeting ?? false),
    };
    onSaveButtonClick(updatedData); // Update DB with current form data
  };

  const handleSendToMeetingClick = () => {
    const updatedData = {
      preferredName: watch("preferredName", content.preferredName ?? ""),
      pronouns: watch("pronouns", content.pronouns ?? ""),
      disclosure: disclosureValue,
      visible: watch("visible", content.visible ?? false),
      fullMessage: watch("fullMessage", content.fullMessage ?? ""),
      sendToMeeting: true,
    };
    onNameTagContentChange(updatedData); // Use onNameTagContentChange like the original toggle
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const styles = {
    input: {
      width: '100%',
      padding: '5px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxSizing: 'border-box' as const,
    },
    select: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f5f5f5',
      boxSizing: 'border-box' as const,
    },
    charCount: {
      fontSize: '14px',
      color: '#666',
      marginTop: '4px',
    },
    charCountWarning: {
      color: '#d32f2f',
    },
    buttonRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '10px',
      marginBottom: '20px',
      gap: '20px',
    },
    saveButtonStyle: {
      padding: '8px 24px',
      fontSize: '14px',
      color: '#1976d2',
      backgroundColor: 'white',
      border: '1px solid #1976d2',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '500',
      textTransform: 'none' as const,
      flexShrink: 0,
    },
    sendButtonStyle: {
      padding: '8px 24px',
      fontSize: '14px',
      color: 'white',
      backgroundColor: '#1976d2',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '500',
      textTransform: 'none' as const,
    },
    divider: {
      border: 'none',
      borderTop: '1px solid #e0e0e0',
      margin: '10px 0',
    },
    disclosureHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '18px',
      fontWeight: '500',
      marginBottom: '12px',
    },
    textarea: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxSizing: 'border-box' as const,
      fontFamily: 'inherit',
      resize: 'vertical' as const,
    },
    switchLabel: {
      margin: 0,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: 'auto',
      marginLeft: 'auto',
      gap: '12px',
    },
  };

  return (
    <div className="tab-container">
      <h2 className="tab-title">Name Tag</h2>

      <div>
        <div style={{ paddingBottom: bottom_padding }}>
          <label htmlFor="name">Preferred Name</label>
          <input
            style={styles.input}
            id="name"
            defaultValue={content.preferredName}
            {...register("preferredName", { required: true })}
          />
        </div>
        <div style={{ paddingBottom: bottom_padding }}>
          <label htmlFor="pronouns">Pronouns</label>
          <select
            className="select-dinput"
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
            style={styles.input}
            id="disclosure"
            defaultValue={content.disclosure}
            {...register("disclosure", { maxLength: maxDisclosureLength })}
          />
          <div style={isOverLimit ? {...styles.charCount, ...styles.charCountWarning} : styles.charCount}>
            <span>
              {disclosureValue.length}/{maxDisclosureLength}
            </span>
            <span style={{fontStyle: 'italic', marginLeft: '4px'}}>
              (Maximum characters allowed)
            </span>
            {isOverLimit && (
              <span style={{display: 'block', color: '#d32f2f'}}>Exceeded length limit!</span>
            )}
          </div>
        </div>

        <div style={styles.buttonRow}>
          <Button
            variant="outlined"
            onClick={handleSaveButtonClick}
            style={styles.saveButtonStyle}
          >
            Save
          </Button>
          
          <Controller
            control={control}
            name="visible"
            defaultValue={content.visible ?? false}
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
                style={styles.switchLabel}
              />
            )}
          />
        </div>

        <hr style={styles.divider} />

        <div style={{marginTop: '20px'}}>
          <div style={styles.disclosureHeader}>
            <span>Disclosure Message</span>
            <Tooltip title="This will send a message to everyone in the meeting">
              <InfoOutlinedIcon
                fontSize="small"
                style={{ cursor: "pointer", color: "#888" }}
              />
            </Tooltip>
          </div>

          <div style={{ paddingBottom: bottom_padding }}>
            <textarea
              style={styles.textarea}
              id="fullMessage"
              rows={3}
              placeholder="Introduce yourself..."
              defaultValue={content.fullMessage}
              {...register("fullMessage")}
            />
          </div>

          <div style={styles.buttonRow}>
            <Button
              variant="outlined"
              onClick={handleSaveButtonClick}
              style={styles.saveButtonStyle}
            >
              Save
            </Button>

            <Button
              variant="contained"
              onClick={handleSendToMeetingClick}
              style={styles.sendButtonStyle}
            >
              Send to Meeting
            </Button>
          </div>

        </div>

        <Snackbar
          open={showToast}
          autoHideDuration={3000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseToast} severity="success" sx={{ width: '100%' }}>
            Successfully sent the message!
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default NameTagForm;