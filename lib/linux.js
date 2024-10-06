"use strict";

/**
 * Return current wifi name
 * 
 * @returns {Promise<string>} current wifi name
 */
export async function currentWifiName() {
  throw new Error("This platform currently unsupported! Contribution to the source code in Github are very welcome");

}

/**
 * get all saved wifi names
 * 
 * @returns {Promise<string[]>} array of string of wifi names
 */
export async function getWifiNames() {
  throw new Error("This platform currently unsupported! Contribution to the source code in Github are very welcome");

}

/**
 * return current wifi password or specified the wifi name to get its password
 * 
 * @param {string} ssid saved wifi name or ssid targeted to get the password
 * @returns {Promise<string>} wifi password
 */
export async function getWifiPassword(ssid, { nullOnError = false }) {
  throw new Error("This platform currently unsupported! Contribution to the source code in Github are very welcome");

};

/**
 * return an array of object of wifi name and password.
 * password might be null or empty string
 * 
 * @returns {Promise<{name: string, password: string?}[]>} array of object of name and password
 */
export default async function getWifiPass() {
  throw new Error("This platform currently unsupported! Contribution to the source code in Github are very welcome");

}