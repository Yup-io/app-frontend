import React from 'react';
import { Route } from 'react-router';

export default (
  <Route>
    <Route path="/" />
    <Route path="/?feed=nfts" />
    <Route path="/?feed=crypto" />
    <Route path="/?feed=mirror" />
    <Route path="/?feed=dailyhits" />
    <Route path="/?feed=new" />
    <Route path="/?feed=politics" />
    <Route path="/?feed=non-corona" />
    <Route path="/?feed=latenightcool" />
    <Route path="/?feed=lol" />
    <Route path="/?feed=brainfood" />

    <Route path="/leaderboard" />
    <Route path="/leaderboard?:site&:subject&:category" />
    <Route path="/search" />
    <Route path="/:username/analytics" />
    <Route path="/collections/:name/:id" />
    <Route path="/:username" />
  </Route>
);
