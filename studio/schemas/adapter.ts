import { defineField, defineType } from "sanity";

export const adapterType = defineType({
  name: "adapter",
  title: "Adapter",
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
    }),
    defineField({
      name: "fromMount",
      title: "From Mount",
      type: "reference",
      to: [{ type: "mount" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "toMount",
      title: "To Mount",
      type: "reference",
      to: [{ type: "mount" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "electronicCommunication",
      title: "Electronic Communication",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "limitations",
      title: "Limitations",
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
