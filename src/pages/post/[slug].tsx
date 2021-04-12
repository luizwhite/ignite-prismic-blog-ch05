import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Prismic from '@prismicio/client';
import { RichText, RichTextBlock } from 'prismic-reactjs';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';

import { useMemo } from 'react';
import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';
import { parseDate } from '../../utils/parseDate';

// import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      // body: {
      //   text: string;
      // }[];
      body: RichTextBlock[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

const Post = ({ post }: PostProps): JSX.Element => {
  const router = useRouter();

  const date = useMemo(() => parseDate(new Date(post.first_publication_date)), [
    post.first_publication_date,
  ]);

  const wordsQuantity = useMemo(
    () =>
      post.data.content.reduce(
        (acc, { heading, body }) =>
          acc +
          heading.split(' ').length +
          RichText.asText(body).split(' ').length,
        0,
      ) + post.data.title.split(' ').length,
    [post.data.content, post.data.title],
  );
  const readingTime = useMemo(() => Math.ceil(wordsQuantity / 200), [
    wordsQuantity,
  ]);

  return (
    <>
      <Header />
      <div
        style={{ backgroundImage: `url(${post.data.banner.url})` }}
        className={styles.banner}
      />
      <main className={styles.contentContainer}>
        {!router.isFallback ? (
          <>
            <h1>{post.data.title}</h1>
            <div className={styles.infoContainer}>
              <div>
                <FiCalendar size={20} />
                <time>{date}</time>
              </div>
              <div>
                <FiUser size={20} />
                <span>{post.data.author}</span>
              </div>
              <div>
                <FiClock size={20} />
                <span>{`${readingTime} min`}</span>
              </div>
            </div>
            {post.data.content.length &&
              post.data.content.map(({ heading, body }) => (
                <div key={heading}>
                  <h2>{heading}</h2>
                  <RichText render={body} />
                </div>
              ))}
          </>
        ) : (
          <div>Carregando...</div>
        )}
      </main>
    </>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const prismic = getPrismicClient();
  const { results } = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      fetch: ['post.title'],
      orderings: '[document.first_publication_date]',
    },
  );

  return {
    paths: results.map(({ uid }) => ({
      params: {
        slug: uid,
      },
    })), // quais gerar durante a build
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const document = await prismic.getByUID('post', String(slug), {});

  const { title, subtitle, author, banner, content } = document.data;
  const post = {
    first_publication_date: document.first_publication_date,
    uid: document.uid,
    data:
      typeof title !== 'string'
        ? {
            title: RichText.asText(title),
            subtitle: RichText.asText(subtitle),
            banner,
            author: RichText.asText(author),
            content: content.map(
              ({
                heading,
                body,
              }: {
                heading: RichTextBlock[];
                body: RichTextBlock[];
              }) => ({
                heading: RichText.asText(heading),
                body,
              }),
            ),
          }
        : {
            title,
            subtitle,
            banner,
            author,
            content: content.map(
              ({
                heading,
                body,
              }: {
                heading: RichTextBlock[];
                body: RichTextBlock[];
              }) => ({
                heading,
                body,
              }),
            ),
          },
  };

  return {
    props: {
      post,
    },
  };
};
