import { defineQuery } from "next-sanity";

export const CAMERAS_QUERY = defineQuery(`
  *[_type == "camera"] | order(brand asc, name asc) {
    _id,
    name,
    brand,
    model,
    sensorFormat,
    releaseYear,
    "mount": mount->{name}
  }
`);
