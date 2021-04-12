import { RichText } from 'prismic-reactjs';
import { Document } from '@prismicio/client/types/documents';

import { Post } from '../pages';

export const parseResults = (results: Document[]): Post[] =>
  results.map(({ uid, first_publication_date, data: postData }) => ({
    uid,
    first_publication_date,
    data:
      typeof postData.title !== 'string'
        ? {
            title: RichText.asText(postData.title),
            subtitle: RichText.asText(postData.subtitle),
            author: RichText.asText(postData.author),
          }
        : {
            title: postData.title,
            subtitle: postData.subtitle,
            author: postData.author,
          },
  }));
