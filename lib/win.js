'use strict';
import { execa } from "execa";

export const getWifiNames = async () => {
	const cmd = 'netsh';
	const args = ['wlan', 'show', "profile"];

	return execa(cmd, args).then(({ stdout }) => {
		let ret;

		ret = [...stdout.matchAll(/^\s*All User Profile\s*: (.+)\s*$/gm)].map(el => el[1]);
		ret = ret && ret.length > 0 ? ret : null;

		if (!ret) {
			throw new Error('Could not get wifi name list');
		}

		return ret;
	});
}

export default async (ssid) => {
	const cmd = 'netsh';
	const args = ['wlan', 'show', 'profile', `name=${ssid}`, 'key=clear'];

	return execa(cmd, args).then(({ stdout }) => {
		let ret;

		ret = /^\s*Key Content\s*: (.+)\s*$/gm.exec(stdout);
		ret = ret && ret.length ? ret[1] : null;

		if (!ret) {
			throw new Error('Could not get password');
		}

		return ret;
	});
};