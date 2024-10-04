"use strict"

import search from "@inquirer/search";
import wifiName from "wifi-name";
import getWifiNames, { getWifiPass } from "./index.js";

try {
  console.log("Getting wifi names and passwords...");

  const currentName = await wifiName();
  const currentPass = await getWifiPass();

  const wifiNameList = await getWifiNames();

  const wifiData = [
    {
      name: currentName,
      value: `WIFI: ${currentName}\nPassword: ${currentPass}`,
      description: "Password: " + currentPass,
    },
    ...await Promise.all(wifiNameList
      .filter(wifiName => wifiName !== currentName)
      .map(async (wifiName) => {
        const wifiPass = await getWifiPass(wifiName);

        return {
          name: wifiName,
          value: `WIFI: ${wifiName}\nPassword: ${wifiPass}`,
          description: "Password: " + wifiPass,
        }
      })
    )
  ]

  search({
    message: 'Select WIFI name',
    source: async (input) => {
      try {
        if (!input) {
          return wifiData;
        }

        return wifiData.filter((data) => data.name.toLowerCase().includes(input));
      } catch (err) {
        console.log("\nfunction error!");
        console.log(err.message);
        process.exit(1);
      }
    },
  }).then((selectedWifiPassword) => {

    console.log(selectedWifiPassword);

  }).catch((err) => {
    if (!err.message.toLowerCase().includes("user force closed the prompt")) {
      console.log("inquirer error");
      console.log(err.message);
    }
  });

} catch (err) {
  console.log("\nfunction error!");
  console.log(err.message);
}
