import { GetStaticProps } from 'next';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts.results)
  const [nextPosts, setNextPosts] = useState(props.posts.next_page)

  async function addPosts() {
    if (nextPosts !== null) {

      await fetch(nextPosts, {method: 'GET'}).then(
        (response) => response.json())
        .then(
          (response) => {

            setPosts([...posts, ...response.results])
            setNextPosts(response.next_page)
          }
          )
      }
  }

  console.log(posts) 
  return(
    <div className={styles.main}>

      {posts.map((current) => {
        return(
          <div key={current.uid} className={styles.post}>
            <Link href={'/'}>
              <a className={styles.title}>
                <h2>{current.data.title[0].text}</h2>
              </a>
            </Link>
            <Link href={'/'}>
              <a className={styles.subTitle}>
                <p>{current.data.subtitle[0].text}</p>
              </a>
            </Link>
            <div className={styles.dateAndAuthor}>
              <div className={styles.postSubContent}>
              <p>ícone</p>
              <p>
                {
                format(new Date(Date.parse(current.first_publication_date)), 
                      'dd MMM yyyy', {locale: ptBR})
                }
                </p>
              </div>
              <div className={styles.postSubContent}>
              <p>ícone</p>
                <p>
                {
                  current.data.author[0].text
                }
                </p>
              </div>
            </div>
          </div>
        )
      })}
      <button className={styles.button} onClick={() => addPosts()}>
        Carregar mais posts
      </button>
    </div>
  )
}

export const getStaticProps = async () => {
   const prismic = getPrismicClient();
   const postsResponse = await prismic.query
   ([ Prismic.Predicates.at('document.type', 'posts')],
   {
     fetch: ['Post.Title', 'Post.Content'],
     pageSize: 5
   });
   console.log(postsResponse)

  // TODO
  return {
    props: {
      posts: postsResponse
    }
  }
};
