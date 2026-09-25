import { defineField, defineType } from "sanity";

export const sourceType = defineType({
  name: "source",
  title: "Source",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publisher",
      title: "Publisher",
      type: "string",
    }),
    defineField({
      name: "retrievedAt",
      title: "Retrieved At",
      type: "datetime",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publisher",
    },
  },
});
