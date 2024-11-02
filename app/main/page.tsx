// Under Review

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
import { createFromConfig, ZoomApiWrapper } from "@/lib/zoomapi";
import { ConfigOptions } from "@zoom/appssdk";
import { fetchNametagFromDB, updateNameTagInDB } from "@/lib/nametag_db";
import Divider from "@mui/material/Divider";

const zoomConfigOptions: ConfigOptions = {
  capabilities: ["setVirtualForeground", "onMyMediaChange"],
};
const zoomApi: ZoomApiWrapper = createFromConfig(zoomConfigOptions);
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
    setNameTagContent(data);
    foregroundDrawer.drawNameTag(data);
  };

  const updateHandWaveBadge = (badge: HandWaveBadge) => {
    foregroundDrawer.drawHandWave(badge);
  };

  useEffect(() => {
    fetchNametagFromDB().then((newNameTag) => {
      if (newNameTag !== undefined) {
        setNameTagContent(newNameTag);
      }
      setNameTagIsLoaded(true);
    });
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
            <NameTagForm
              content={nameTagContent}
              disabled={!nameTagIsLoaded}
              onNameTagContentChange={updateNameTagContent}
              onSaveButtonClick={updateNameTagInDB}
            />
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
