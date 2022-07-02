import withSuspense from '../../hoc/withSuspense';
import { LOADER_TYPE } from '../../constants/enum';
import { useUserCollections } from '../../hooks/queries';
import { Grid, Typography } from '@mui/material';
import { FlexBox } from '../styles';
import CollectionCard from '../CollectionCard';
import { useState } from 'react';
import { USER_COLLECTION_PAGE_SIZE } from '../../config';
import CollectionPagination from './CollectionPagination';

const UserCollectionsSection = ({ userId }) => {
  const [page, setPage] = useState(0);
  const collections = useUserCollections(userId);

  const pageStartIndex = page * USER_COLLECTION_PAGE_SIZE;
  const pageCollections = collections.slice(pageStartIndex, Math.min(pageStartIndex + USER_COLLECTION_PAGE_SIZE, collections.length));

  return (
    <>
      <FlexBox
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.5 }}
      >
        <FlexBox alignItems="center">
          <Typography variant="h5">
            Collections
          </Typography>
          <Typography
            variant="body2"
            sx={{
              ml: 0.5,
              color: (theme) => theme.palette.M400
            }}
          >
            ({collections.length})
          </Typography>
        </FlexBox>
        <CollectionPagination
          page={page}
          total={collections.length}
          pageSize={USER_COLLECTION_PAGE_SIZE}
          onSetPage={setPage}
        />
      </FlexBox>
      <Grid container spacing={2.5}>
        {pageCollections.map((collection) => (
          <Grid item xs={6}>
            <CollectionCard data={collection} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default withSuspense(LOADER_TYPE.DEFAULT)(UserCollectionsSection);
