import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'
import { useRouter } from 'next/router';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';



import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import router from 'next/router';
import { RichText } from 'prismic-dom';
import { title } from 'process';

interface Post {
  data: {
    createdAt: string | null;
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
  const createdAt = format(new Date(Date.parse(post.data.createdAt)), 
  'dd MMM yyyy', {locale: ptBR})
  return(
    <>
      <img src="" alt="" />
      <div className={styles.main}>
        <h1>{data.title}</h1>
        <div>
          ícone {createdAt}
        </div>
        <div>ícone {data.author}</div>
        <div>ícone {`${'tempo'} min `}</div>
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
  const response = await prismic.getByUID('posts', params.slug, {});
  // TODO
  const post = {
    data: {
      
      title: RichText.asText(response.data.title),
      content: RichText.asHtml(response.data.content[0].body),
      author: RichText.asText(response.data.author),
      createdAt: response.first_publication_date,
    }
    
  }
  return { 
    props: {
      post: post
    }
  }
};