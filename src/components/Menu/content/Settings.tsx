import {
  AddToQueue,
  RemoveFromQueue,
  VolumeDown,
  VolumeUp,
} from "@mui/icons-material";
import { FormControlLabel, Slider, Stack, Switch } from "@mui/material";
import { useState } from "react";
import { userSettings } from "../../../game/userSettings";
import { renderMetrics } from "../../../game/renderMetrics";

const marks = [
  {
    value: 1,
    label: "low",
  },
  {
    value: 2,
    label: "medium",
  },
  {
    value: 3,
    label: "high",
  },
];

function MenuContentSettings() {
  const [volume, setVolume] = useState(userSettings.audioVolume);
  const [antialiasing, setAntialiasing] = useState(
    userSettings.graphicsAntialias() === 1,
  );
  const [graphicsResolution, setGraphicsResolution] = useState(
    userSettings.graphicsResolution(),
  );
  return (
    <div className="settingsMenuContent scroller">
      <br />
      Volume
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <VolumeDown />
        <Slider
          aria-label="Audio Volume"
          value={volume}
          onChange={(_mouseEvent, value) => {
            if (typeof value === "number") {
              localStorage.setItem("audioVolume", value.toString());
              setVolume(value);
              // getGameEngine().game.player.audio.audioListener.setMasterVolume(
              //   value * 0.01,
              // );
            }
          }}
        />
        <VolumeUp />
      </Stack>
      Graphics Resolution
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <RemoveFromQueue />
        <Slider
          aria-label="Graphics Resolution"
          value={graphicsResolution}
          step={null}
          marks={marks}
          min={1}
          max={3}
          onChange={(_mouseEvent, value) => {
            if (typeof value === "number") {
              localStorage.setItem("graphicsResolution", value.toString());
              setGraphicsResolution(value);
              renderMetrics.pixelDownsample.value = value;
            }
          }}
        />
        <AddToQueue />
      </Stack>
      <br />
      <br />
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <FormControlLabel
          control={
            <Switch
              checked={antialiasing}
              onChange={() =>
                setAntialiasing((prevAntialiasing) => {
                  const active = !prevAntialiasing;
                  localStorage.setItem("graphicsAntialias", active ? "1" : "0");
                  setTimeout(() => window.location.reload(), 100);
                  return active;
                })
              }
            />
          }
          label="Anti-aliasing (will cause a refresh)"
        />
      </Stack>
    </div>
  );
}

export default MenuContentSettings;
