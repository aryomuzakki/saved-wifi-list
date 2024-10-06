"use strict";

let platformLib;

if (process.platform === "win32") {
	platformLib = (await import("./lib/win.js"));
} else if (process.platform === "darwin") {
	platformLib = (await import("./lib/osx.js"));
} else {
	platformLib = (await import("./lib/linux.js"));
}

export const currentWifiName = async () => {
	return await platformLib.currentWifiName();
}

export const getWifiNames = async () => {
	return await platformLib.getWifiNames();
}

export const getWifiPassword = async (ssid) => {
	if (ssid) {
		return platformLib.getWifiPassword(ssid);
	}

	const wifiSSID = await currentWifiName();

	return await platformLib.getWifiPassword(wifiSSID);
}

const savedWifiList = async () => {
	return await platformLib.default();
}

export default savedWifiList;
