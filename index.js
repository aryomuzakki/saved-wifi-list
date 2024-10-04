"use strict";

import wifiName from "wifi-name";

const getWifiNames = async () => {
	let fn = (await import("./lib/linux.js")).getWifiNames;

	if (process.platform === "darwin") {
		fn = (await import("./lib/osx.js")).getWifiNames;
	}

	if (process.platform === "win32") {
		fn = (await import("./lib/win.js")).getWifiNames;
	}

	return await fn();
}

export const getWifiPass = async (ssid) => {
	let fn = (await import("./lib/linux.js")).default;

	if (process.platform === "darwin") {
		fn = (await import("./lib/osx.js")).default;
	}

	if (process.platform === "win32") {
		fn = (await import("./lib/win.js")).default;
	}

	if (ssid) {
		return fn(ssid);
	}

	const wifiSSID = await wifiName();

	return await fn(wifiSSID);
}

export default getWifiNames;
