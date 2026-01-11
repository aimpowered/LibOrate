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
import { SessionProvider, useSession } from "next-auth/react";

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
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const foregroundDrawerRef = useRef<DrawBadgeApi | null>(null);
  const zoomApiRef = useRef<ZoomApiWrapper | null>(null);
  const session = useSession();
  const logged = useRef(false);

  useEffect(() => {
    if (session.status !== "authenticated" || logged.current) return;
    log(Action.LOG_IN, session.data.user?.email || undefined);
    logged.current = true;
  }, [session, logged]);

  useEffect(() => {
    const init = async () => {
      const zoomApi: ZoomApiWrapper = await getZoomApi();
      foregroundDrawerRef.current = new DrawBadgeApi(zoomApi);
      zoomApiRef.current = zoomApi;
    };
    init();
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;

    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.clientHeight);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, []);

  const updateNameTagContent: SubmitHandler<NameTagContent> = (data) => {
    if (nameTagContent.visible !== data.visible) {
      if (data.visible) {
        log(Action.NAME_BADGE_ON, session?.data?.user?.email || undefined, {
          preferredName: data.preferredName,
          pronouns: data.pronouns,
          disclosure: data.disclosure,
          fullMessage: data.fullMessage,
        });
      } else {
        log(Action.NAME_BADGE_OFF, session?.data?.user?.email || undefined);
      }
    }
    if (
      data.sendToMeeting &&
      (!nameTagContent.sendToMeeting ||
        data.fullMessage !== nameTagContent.fullMessage)
    ) {
      log(Action.DISCLOSURE_SENT, session?.data?.user?.email || undefined, {
        fullMessage: data.fullMessage,
      });
      zoomApiRef.current?.sendMessageToChat(data.fullMessage);
    }
    setNameTagContent(data);
    foregroundDrawerRef.current?.drawNameTag(data);
  };

  const updateHandWaveBadge = (badge: HandWaveBadge) => {
    if (badge.visible) {
      log(Action.HAND_WAVE_ON, session?.data?.user?.email || undefined, {
        waveText: badge.waveText,
      });
    } else {
      log(Action.HAND_WAVE_OFF, session?.data?.user?.email || undefined);
    }
    foregroundDrawerRef.current?.drawHandWave(badge);
  };

  const addWaveHandToDBWithLog = (waveText: string) => {
    log(Action.HAND_WAVE_ADDED, session?.data?.user?.email || undefined, {
      waveText,
    });
    addWaveHandToDB(waveText);
  };

  const deleteWaveHandFromDBWithLog = (id: number, waveText: string) => {
    log(Action.HAND_WAVE_DELETED, session?.data?.user?.email || undefined, {
      waveText,
    });
    deleteWaveHandFromDB(id);
  };

  const updateNameTagInDBWithLog = (nameTagContent: NameTagContent) => {
    log(Action.NAME_BADGE_UPDATED, session?.data?.user?.email || undefined, {
      preferredName: nameTagContent.preferredName,
      pronouns: nameTagContent.pronouns,
      disclosure: nameTagContent.disclosure,
      fullMessage: nameTagContent.fullMessage,
    });
    updateNameTagInDB(nameTagContent);
  };

  const addAffirmationToDBWithLog = (text: string) => {
    log(Action.AFFIRMATION_ADDED, session?.data?.user?.email || undefined, {
      affirmation: text,
    });
    addAffirmationToDB(text);
  };

  const deleteAffirmationFromDBWithLog = (id: number, text: string) => {
    log(Action.AFFIRMATION_DELETED, session?.data?.user?.email || undefined, {
      affirmation: text,
    });
    deleteAffirmationFromDB(id);
  };

  const updateAffirmationFromDBWithLog = (
    id: number,
    oldText: string,
    newText: string,
  ) => {
    log(Action.AFFIRMATION_UPDATED, session?.data?.user?.email || undefined, {
      oldAffirmation: oldText,
      newAffirmation: newText,
    });
    updateAffirmationFromDB(id, newText);
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
      log(Action.ERROR, session?.data?.user?.email || undefined, {
        message: (err as Error).message,
        source: "app/main/page.tsx - fetchUser",
      });
      setHasError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <div className="header" ref={headerRef}>
        {!isLoading && (
          <AffirmationCarousel
            initialAffirmations={affirmations}
            onAdd={addAffirmationToDBWithLog}
            onDelete={deleteAffirmationFromDBWithLog}
            onUpdate={updateAffirmationFromDBWithLog}
          />
        )}
      </div>

      <div
        className="scrollable-content"
        style={{ marginTop: `${headerHeight}px` }}
      >
        <div>
          {!isLoading && (
            <WaveHandPicker
              initialHands={waveHandButtons}
              updateHandWaveBadge={updateHandWaveBadge}
              hasError={hasError}
              onRetry={fetchUser}
              onAdd={addWaveHandToDBWithLog}
              onDelete={deleteWaveHandFromDBWithLog}
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
                  onSaveButtonClick={updateNameTagInDBWithLog}
                />
              )}
            </div>

            <div page-label="mindfulness">
              <Mindfulness
                onPlay={(videoId: string, name: string) =>
                  log(
                    Action.MINDFULNESS_VIDEO_PLAYED,
                    session?.data?.user?.email || undefined,
                    {
                      videoId,
                      name,
                    },
                  )
                }
              />
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function MainPage() {
  return (
    <SessionProvider>
      <App />
    </SessionProvider>
  );
}
