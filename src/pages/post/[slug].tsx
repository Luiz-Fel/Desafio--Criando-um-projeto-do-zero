import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'


import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import router from 'next/router';

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
  // TODO
}
export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(Prismic.predicates.at('document.type', 'post'));
  // TODO
};
export const getStaticProps = async context => {
  const prismic = getPrismicClient();
  const slug = router.query
  // T E S T A R console.log() 
  const response = await prismic.getByUID('posts', String(slug), {});
  // TODO
};