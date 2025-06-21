"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { SubmitHandler } from "react-hook-form";
import Tabs from "./Tabs";
import Mindfulness from "./Mindfulness";
import { NameTagContent, NameTagForm } from "@/components/NameTagForm";
import { WaveHandPicker } from "@/components/WaveHandPicker";
import { AffirmationCarousel } from "@/components/AffirmationCarousel";
import { HandWaveBadge, DrawBadgeApi } from "@/lib/draw_badge_api";
import { updateNameTagInDB } from "@/lib/nametag_db";
import Divider from "@mui/material/Divider";
import { Action, log } from "@/lib/log";
import { fetchUserFromDB } from "@/lib/user_db";
import { addWaveHandToDB, deleteWaveHandFromDB } from "@/lib/wavehand_db";
import {
  addAffirmationToDB,
  deleteAffirmationFromDB,
  updateAffirmationFromDB,
} from "@/lib/affirmation_db";
import { getZoomApi } from "@/lib/zoomapi_loader";
import { ZoomApiWrapper } from "@/lib/zoomapi";

const defaultNameTag: NameTagContent = {
  visible: false,
  preferredName: "",
  pronouns: "",
  disclosure: "I have a stutter",
  fullMessage: "",
  sendToMeeting: false,
};

function App() {
  const [nameTagContent, setNameTagContent] =
    useState<NameTagContent>(defaultNameTag);

  const [waveHandButtons, setWaveHandButtons] = useState<string[]>([]);
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const foregroundDrawerRef = useRef<DrawBadgeApi | null>(null);
  const zoomApiRef = useRef<ZoomApiWrapper | null>(null);

  useEffect(() => {
    const init = async () => {
      const zoomApi: ZoomApiWrapper = await getZoomApi();
      foregroundDrawerRef.current = new DrawBadgeApi(zoomApi);
      zoomApiRef.current = zoomApi;
    };
    init();
  }, []);

  const updateNameTagContent: SubmitHandler<NameTagContent> = (data) => {
    if (nameTagContent.visible !== data.visible) {
      log(data.visible ? Action.NAME_BADGE_ON : Action.NAME_BADGE_OFF);
    }
    if (
      data.sendToMeeting &&
      (!nameTagContent.sendToMeeting ||
        data.fullMessage !== nameTagContent.fullMessage)
    ) {
      zoomApiRef.current?.sendMessageToChat(data.fullMessage);
    }
    setNameTagContent(data);
    foregroundDrawerRef.current?.drawNameTag(data);
  };

  const updateHandWaveBadge = (badge: HandWaveBadge) => {
    foregroundDrawerRef.current?.drawHandWave(badge);
  };

  const fetchUser = async () => {
    try {
      const user = await fetchUserFromDB();
      if (user.nameTag !== undefined) {
        setNameTagContent(user.nameTag);
      }
      if (user.waveHands !== undefined) {
        setWaveHandButtons(user.waveHands);
      }
      if (user.affirmations !== undefined) {
        setAffirmations(user.affirmations);
      }
      setHasError(false);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setHasError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <div className="header">
        {!isLoading && (
          <AffirmationCarousel
            initialAffirmations={affirmations}
            onAdd={addAffirmationToDB}
            onDelete={deleteAffirmationFromDB}
            onUpdate={updateAffirmationFromDB}
          />
        )}
      </div>

      <div>
        {!isLoading && (
          <WaveHandPicker
            initialHands={waveHandButtons}
            updateHandWaveBadge={updateHandWaveBadge}
            hasError={hasError}
            onRetry={fetchUser}
            onAdd={addWaveHandToDB}
            onDelete={deleteWaveHandFromDB}
          />
        )}
      </div>

      <Divider />

      <div>
        <Tabs>
          <div page-label="nametag">
            {!hasError && !isLoading && (
              <NameTagForm
                content={nameTagContent}
                onNameTagContentChange={updateNameTagContent}
                onSaveButtonClick={updateNameTagInDB}
              />
            )}
          </div>

          <div page-label="mindfulness">
            <Mindfulness />
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
