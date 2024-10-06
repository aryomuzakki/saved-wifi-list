"use strict";
import { execa } from "execa";

export async function isConnected() {
	const cmd = "netsh";
	const args = ["wlan", "show", "interface"];

	return execa(cmd, args).then(({ stdout }) => {
		let isConnected = /^\s*State\s*: (.+)\s*$/gm.exec(stdout);

		isConnected = isConnected[1] === "connected";

		return isConnected;
	});
}

/**
 * Return current wifi name
 * 
 * @returns {Promise<string>} current wifi name
 */
export async function currentWifiName() {
	const cmd = "netsh";
	const args = ["wlan", "show", "interface"];

	return execa(cmd, args).then(({ stdout }) => {
		let ret;

		ret = /^\s*SSID\s*: (.+)\s*$/gm.exec(stdout);
		ret = ret && ret.length ? ret[1] : null;

		if (!ret) {
			let isConnected = /^\s*State\s*: (.+)\s*$/gm.exec(stdout);

			isConnected = isConnected[1] === "connected";
			if (!isConnected) {
				throw new Error("Not currently connected to a WIFI");
			}
			throw new Error("Could not get SSID");
		}

		return ret;
	});
}

/**
 * get all saved wifi names
 * 
 * @returns {Promise<string[]>} array of string of wifi names
 */
export async function getWifiNames() {
	const cmd = "netsh";
	const args = ["wlan", "show", "profile"];

	return execa(cmd, args).then(({ stdout }) => {
		let ret;

		ret = [...stdout.matchAll(/^\s*All User Profile\s*: (.+)\s*$/gm)].map(el => el[1]);
		ret = ret && ret.length > 0 ? ret : null;

		if (!ret) {
			throw new Error("Could not get wifi name list");
		}

		return ret;
	});
}

/**
 * return wifi password of the specified wifi name / ssid
 * 
 * @param {string} ssid saved wifi name or ssid that needed to get the password
 * @param {{nullOnError: true | false}} [nullOnError=] when set to `true`, will return null in password if password cannot be found, else throw error. Default to `false`.
 * @returns {Promise<string>} wifi password
 */
export async function getWifiPassword(ssid, { nullOnError = false }) {
	const cmd = "netsh";
	const args = ["wlan", "show", "profile", `name=${ssid}`, "key=clear"];

	return execa(cmd, args).then(({ stdout }) => {
		let ret;

		ret = /^\s*Key Content\s*: (.+)\s*$/gm.exec(stdout);
		ret = ret && ret.length ? ret[1] : null;

		if (!ret) {
			if (nullOnError) return null;
			throw new Error("Could not get password");
		}

		return ret;
	});
};

/**
 * return an array of object of wifi name and password.
 * password might be null
 * 
 * @returns {Promise<{name: string, password: string?}[]>} array of object of name and password
 */
export default async function getSavedWifi() {
	const wifiNames = await getWifiNames();

	let curWifiName = "";
	let curWifi;

	const isWIFIConnected = await isConnected();

	if (isWIFIConnected) {
		curWifiName = await currentWifiName();

		curWifi = {
			name: curWifiName,
			password: await getWifiPassword(curWifiName, { nullOnError: true }),
		}
	}

	const savedWifi = [
		...await Promise.all(wifiNames
			.filter(wifiName => wifiName !== curWifiName)
			.map(async (wifiName) => {
				return {
					name: wifiName,
					password: await getWifiPassword(wifiName, { nullOnError: true }),
				}
			})
		),
	]

	curWifi && savedWifi.unshift(curWifi);

	return savedWifi
}