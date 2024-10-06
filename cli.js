#!/usr/bin/env node

"use strict";

import search from "@inquirer/search";
import clipboard from "clipboardy";
import savedWifiList from "./index.js";

try {
  console.log("Getting wifi names and passwords...");

  const savedWifi = await savedWifiList();

  const wifiData = savedWifi.map((wifi) => {
    return {
      name: wifi.name,
      value: wifi,
      description: "Password: " + (wifi?.password || ""),
    }
  })

  search({
    message: "Select WIFI name",
    source: async (input) => {
      try {
        if (!input) {
          return wifiData;
        }

        return wifiData.filter((data) => data.name.toLowerCase().includes(input));
      } catch (err) {
        console.log(err.message);
        process.exit(1);
      }
    },
  }).then((selectedWifi) => {

    console.log(`WIFI: ${selectedWifi.name}\nPassword: ${selectedWifi?.password || ""}`);

    if (selectedWifi.password) {
      clipboard.write(selectedWifi.password).then(() => console.log("Password copied to clipboard!"));
    }

  }).catch((err) => {
    if (!err.message.toLowerCase().includes("user force closed the prompt with 0 null")) {
      console.log(err.message);
    }
  });

} catch (err) {
  console.log(err.message);
}
