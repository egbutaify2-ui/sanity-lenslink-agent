import { defineField, defineType } from "sanity";

export const cameraType = defineType({
  name: "camera",
  title: "Camera",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "model",
      title: "Model",
      type: "string",
    }),
    defineField({
      name: "mount",
      title: "Mount",
      type: "reference",
      to: [{ type: "mount" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sensorFormat",
      title: "Sensor Format",
      type: "string",
    }),
    defineField({
      name: "releaseYear",
      title: "Release Year",
      type: "number",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "sources",
      title: "Sources",
      type: "array",
      of: [{ type: "reference", to: [{ type: "source" }] }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "brand",
    },
  },
});
