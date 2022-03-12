import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'
import { useRouter } from 'next/router';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';
import { FiClock, FiUser, FiCalendar } from "react-icons/fi";



import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import router from 'next/router';
import { RichText } from 'prismic-dom';
import { title } from 'process';

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
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post } : PostProps) {
  const data = post.data
  const timeToRead = (Math.ceil(
    post.data.content[0].body.reduce((pre, cur) => 
      cur.text.split(/[,.\s]/).length + pre, 0)
       / 200))
   const createdAt = new Date(post.first_publication_date)
  return(
    <>
      <img src="" alt="" />
      <div className={styles.main}>
        <h1 className={styles.title[0]}>{data.title}</h1>
        <div className={styles.subTitle}>
          <div className={styles.subTitleContainer}>
            <FiCalendar /> {createdAt}
          </div>
          <div className={styles.subTitleContainer}>
            <FiUser /> {data.author}
          </div>
          <div className={styles.subTitleContainer}>
            <FiClock /> {`${timeToRead} min `}
          </div>
        </div>
        <div dangerouslySetInnerHTML={{__html: String(data.content)}} />
      </div>
    </>
  )
}



export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query
  ([ Prismic.Predicates.at('document.type', 'posts')],
  {
    fetch: ['Post.Title', 'Post.Content'],
  });  // TODO

  return { 
    paths: postsResponse.results.map((current) => { 
      return { params: { slug : current.uid } }
    }),
    fallback: false,
  }
};



export const getStaticProps = async ({params}) => {
  const prismic = getPrismicClient();
  const post = await prismic.getByUID('posts', params.slug, {});
  
  
  return { 
    props: {
      post,
    }
  }
};