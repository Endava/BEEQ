import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';

import type { JsonDocs } from '@stencil/core/internal';

export const generateCustomElementsJson = async (docsData: JsonDocs) => {
  const jsonData = {
    version: '1.0.0',
    modules: docsData.components.map((component) => ({
      kind: 'javascript-module',
      path: component.filePath,
      declarations: [
        {
          kind: 'class',
          name: component.fileName,
          tagName: component.tag,
          description: component.docs,

          attributes: component.props
            .filter((prop) => prop.attr)
            .map((prop) => ({
              name: prop.attr,
              type: {
                text: prop.type,
              },
              description: prop.docs,
              default: prop.default,
              required: prop.required,
            })),

          members: [
            ...component.props
              .filter((prop) => !prop.attr)
              .map((prop) => ({
                kind: 'field',
                name: prop.name,
                type: {
                  text: prop.type,
                },
                description: prop.docs,
                default: prop.default,
                required: prop.required,
              })),

            ...component.methods.map((method) => ({
              kind: 'method',
              name: method.name,
            })),
          ],

          events: component.events.map((event) => ({
            name: event.event,
            type: {
              text: event.detail,
            },
            description: event.docs,
          })),

          slots: component.slots.map((slot) => ({
            name: slot.name,
            description: slot.docs,
          })),

          cssProperties: component.docsTags
            .filter((tag) => tag.name === 'cssprop')
            .map((tag) => {
              const [name, description] = tag.text.split(' - ');
              return { name: name?.trim(), description: description?.trim() };
            }),

          cssParts: component.parts.map((part) => ({
            name: part.name,
            description: part.docs,
          })),
        },
      ],
    })),
  };

  await fs.writeFile(resolve(__dirname, '../../.storybook/custom-elements.json'), JSON.stringify(jsonData, null, 2));
};
