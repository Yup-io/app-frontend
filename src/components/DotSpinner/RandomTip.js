import React from 'react'
import { Typography } from '@mui/material'
import './dotspinner.module.css'

const tips = [
  'Nuanced ratings (5/5, 4/5, 1/5) use up more of your ratings, but earn you more YUP.',
  'Whenever someone rates content after you using the same sentiment, you earn YUP.',
  'Ratings refresh every 24 hours.',
  'Likes count as a 3/5 rating on Yup. Rate with nuance (5/5, 4/5, 1/5) using the Yup extension, or Yup button on certain sites, to earn even more rewards.',
  'Use the Yup button next to content on Twitter, Reddit, Youtube and others to rate directly from those sites.',
  'Think something is hilarious, or brilliant? Rate using the Yup categories.',
  'On some sites (like Google Maps), rating categories are different 😮.',
  "Color codes show the Yup community's collective opinion of content.",
  'Influence is a function of YUP holdings, social rank, and activity. The more influence you have, the more weight your rating have and the more YUP you potentially earn.',
  'Keep track of your likes/ratings with the activity page in the extension pop-up.',
  "Prioritize content you like in your feeds by clicking on user's profile and hitting the 'follow' button on their profile."
]
const randomTip = tips[Math.floor(Math.random() * tips.length)]

export default function RandomTip () {
  return (
    <Typography variant='h1'
      className='tip'
    >{randomTip}</Typography>
  )
}
