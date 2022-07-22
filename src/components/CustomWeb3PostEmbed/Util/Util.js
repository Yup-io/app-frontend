/* eslint-disable */
import React, { Component, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import ReactPlayer from 'react-player/lazy';
import Link from '@mui/material/Link';
import axios from 'axios';
import _ from 'lodash';
import { apiBaseUrl } from '../../../config';

/**
 * - Removes https://t.co/ERYj5p9VHj that comes at end of text field in tweetData object if present
 * - Replaces '&amp;' with '&'
 * - Replaces '&nbsp;' with ' '
 *
 * @param {*} str text string to parse
 */
export const parseText = (str) => {
  const re = /http\S+/;
  const parsed = str
    .replace(re, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n\n/g, ' ');
  return parsed;
};

// Removes : and - after @tag (if someone types @myusername: it changes it to @myusername
export const parseTags = (str) => {
  const re = /[:-]/;
  const parsed = str.replace(re, '');
  return parsed;
};

// Converts http://www.example.com/page1/resource1 into --> example.com
export const linkMentions = (word) => {
  const { palette } = useTheme();
  const re = /\B\@([\w\-]+)/gim;
  const match = re.test(word);
  if (match) {
    word = parseTags(word);
    const userLink = `https://twitter.com/${word}`;
    return (
      <>
        <a
          style={{
            color: palette.M100,
            textDecoration: 'none',
            fontWeight: 600
          }}
          href={userLink}
          target="_blank"
        >
          {word}
        </a>
        <i> </i>
      </>
    );
  } else {
    return <>{word} </>;
  }
};

export const fetchLinkPreviewData = async (passedURL) => {
  try {
    const res = await axios.get(`${apiBaseUrl}/posts/linkpreview`, {
      params: {
        url: passedURL
      }
    });
    const { previewData } = res.data;
    return previewData;
  } catch (e) {
    console.log(e);
  }
};
