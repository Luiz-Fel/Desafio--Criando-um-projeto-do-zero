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
import { title } from 'process';
import { RichText } from 'prismic-dom';

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
  const postRouter = useRouter()
  if (postRouter.isFallback) {
    return (
      <h1>Carregando...</h1>
    )
  }

  const data = post.data
  const content =  data.content.map((cur) => {
    return RichText.asText(cur.body)
  })
 
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAA')

  const timeToRead = (Math.ceil(content.reduce((acc, cur,) => {
    
    const lentgtOfText = cur.split(/[,.\s]/).length
    return acc + lentgtOfText
  }, 0) / 200))
  const createdAt =  format(
    new Date(post.first_publication_date),
    "dd MMM yyyy",
    {
      locale: ptBR,
    }
    )
  



  return(
    <>
      <img src={data.banner.url} alt="" />
      <div className={styles.main}>
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.subTitle}>
          <div className={styles.subTitleContainer}>
            <FiCalendar /> 
            <span>{createdAt}</span>
          </div>
          <div className={styles.subTitleContainer}>
            <FiUser /> {data.author}
          </div>
          <div className={styles.subTitleContainer}>
            <FiClock /> {`${timeToRead} min `}
          </div>
        </div>
        <div>
          {content.map((text) => {
            return(
              <p key={content.indexOf(text)}>{text}</p>
            )
          })}
        </div>
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
    fallback: true,
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