import NodeGeocoder from "node-geocoder";

const options = {
  provider: "google",

  // Optional depending on the providers
  apiKey: process.env.GEO_CODING_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

/**
 * Summary: This function is used to get latitude/longitude based on address.
 * @param {*} input
 * @returns
 */
export async function getLatLongFromAddress(input) {
  if (
    typeof input != "string" ||
    input == "" ||
    input == null ||
    input == "undefined" ||
    typeof input == undefined
  )
    return false;

  // Using callback
  const res = await geocoder.geocode(input);

  return res;
}
