import { defineField, defineType } from "sanity";

export const lensType = defineType({
  name: "lens",
  title: "Lens",
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
      name: "nativeMount",
      title: "Native Mount",
      type: "reference",
      to: [{ type: "mount" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "focalLength",
      title: "Focal Length",
      type: "string",
    }),
    defineField({
      name: "maximumAperture",
      title: "Maximum Aperture",
      type: "string",
    }),
    defineField({
      name: "sensorCoverage",
      title: "Sensor Coverage",
      type: "string",
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
