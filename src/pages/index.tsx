import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiUser, FiCalendar } from 'react-icons/fi';

import { useCallback, useState } from 'react';
import { getPrismicClient } from '../services/prismic';

// import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { parseResults } from '../utils/parseResults';
import { parseDate } from '../utils/parseDate';

export interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string | null;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [posts] = useState(postsPagination.results);

  const handleClick = useCallback(async () => {
    await fetch(nextPage, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        posts.push(...parseResults(data.results));
        setNextPage(data.next_page);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }, [nextPage, posts]);

  return (
    <>
      <main className={styles.postsListContainer}>
        <img src="/spacetraveling.svg" alt="logo" />
        {posts.map(({ uid, data, first_publication_date }) => {
          const date = parseDate(new Date(first_publication_date));

          return (
            <div key={uid}>
              <Link href={`/post/${uid}`}>
                <h1>{data.title}</h1>
              </Link>
              <h3>{data.subtitle}</h3>
              <div className={styles.infoContainer}>
                <div>
                  <FiCalendar size={20} />
                  <time>{date}</time>
                </div>
                <div>
                  <FiUser size={20} />
                  <span>{data.author}</span>
                </div>
              </div>
            </div>
          );
        })}
        {nextPage && (
          <div>
            <button
              className={styles.nextPageButton}
              onClick={handleClick}
              type="button"
            >
              Carregar mais posts
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const pageSize = 1;
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize,
      orderings: '[document.first_publication_date]',
    },
  );

  const posts = parseResults(postsResponse.results);

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
    revalidate: 1,
  };
};
