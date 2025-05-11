"use client";

import React from "react";
import { useState, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import Tabs from "./Tabs";
import Mindfulness from "./Mindfulness";
import { NameTagContent, NameTagForm } from "@/components/NameTagForm";
import { WaveHandPicker } from "@/components/WaveHandPicker";
import { AffirmationCarousel } from "@/components/AffirmationCarousel";
import { HandWaveBadge, DrawBadgeApi } from "@/lib/draw_badge_api";
import { zoomApi } from "@/lib/zoomapi";
import { fetchNametagFromDB, updateNameTagInDB } from "@/lib/nametag_db";
import Divider from "@mui/material/Divider";
import { Action, log } from "@/lib/log";

const foregroundDrawer: DrawBadgeApi = new DrawBadgeApi(zoomApi);

const defaultWaveHandButtons = [
  "",
  "I'm not done",
  "Question",
  "Agree",
  "Different Opinion",
  "Support",
];

const defaultAffirmations = [
  { id: 0, text: "Say what I want to say, whatever happens will help me grow" },
  { id: 1, text: "I can take up space" },
  { id: 2, text: "I have an important voice" },
  { id: 3, text: "Feel the tension and proceed" },
  { id: 4, text: "I have the right to stutter" },
];

const defaultNameTag: NameTagContent = {
  visible: false,
  preferredName: "",
  pronouns: "",
  disclosure: "I have a stutter",
};

function App() {
  const [nameTagContent, setNameTagContent] =
    useState<NameTagContent>(defaultNameTag);

  const [nameTagIsLoaded, setNameTagIsLoaded] = useState(false);

  const updateNameTagContent: SubmitHandler<NameTagContent> = (data) => {
    if (nameTagContent.visible !== data.visible) {
      log(data.visible ? Action.NAME_BADGE_ON : Action.NAME_BADGE_OFF);
    }
    setNameTagContent(data);
    foregroundDrawer.drawNameTag(data);
  };

  const updateHandWaveBadge = (badge: HandWaveBadge) => {
    foregroundDrawer.drawHandWave(badge);
  };

  useEffect(() => {
    fetchNametagFromDB()
      .then((newNameTag) => {
        if (newNameTag !== undefined) {
          setNameTagContent(newNameTag);
        }
        setNameTagIsLoaded(true);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div className="header">
        <AffirmationCarousel initialAffirmations={defaultAffirmations} />
      </div>

      <WaveHandPicker
        initialHands={defaultWaveHandButtons}
        updateHandWaveBadge={updateHandWaveBadge}
      />

      <Divider />

      <div>
        <Tabs>
          <div page-label="nametag">
            {nameTagIsLoaded && (
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
