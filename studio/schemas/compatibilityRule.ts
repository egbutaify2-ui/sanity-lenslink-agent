import { defineField, defineType } from "sanity";

export const compatibilityRuleType = defineType({
  name: "compatibilityRule",
  title: "Compatibility Rule",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "camera",
      title: "Camera",
      type: "reference",
      to: [{ type: "camera" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lens",
      title: "Lens",
      type: "reference",
      to: [{ type: "lens" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "compatibility",
      title: "Compatibility",
      type: "string",
      options: {
        list: [
          { title: "Directly compatible", value: "direct" },
          { title: "Compatible with adapter", value: "adapter" },
          { title: "Not compatible", value: "no" },
          { title: "Unknown / needs verification", value: "unknown" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "adapter",
      title: "Required Adapter",
      type: "reference",
      to: [{ type: "adapter" }],
    }),
    defineField({
      name: "explanation",
      title: "Explanation",
      type: "text",
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "conditions",
      title: "Conditions",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "sources",
      title: "Sources",
      type: "array",
      of: [{ type: "reference", to: [{ type: "source" }] }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "compatibility",
    },
  },
});
