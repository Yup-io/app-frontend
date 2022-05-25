import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { apiBaseUrl } from '../../config'
import { PageBody } from '../../_pages/pageLayouts'
import Grid from '@mui/material/Grid'
import PostDisplay from '../../components/Post/PostDisplay'
import { CreateCollectionFab } from '../../components/Miscellaneous'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'

const PostDetails = () => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = router.query;

  const fetchPost = async () => {
    try {
      const postData = (await axios.get(`${apiBaseUrl}/posts/post/${id}`)).data
      setIsLoading(false);
      setPost(postData);
    } catch (err) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  return (
    <ErrorBoundary>
      <PageBody>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={{
            height: '100vh'
          }}
        >
          <PostDisplay isLoading={isLoading} post={post} />
        </Grid>
        <CreateCollectionFab/>
      </PageBody>
    </ErrorBoundary>
  );
};

export default PostDetails;
