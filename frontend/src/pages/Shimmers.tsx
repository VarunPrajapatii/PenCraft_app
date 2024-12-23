import React from "react";
import { BlogShimmer } from "../components/loadingAndShimmers/BlogShimmer";
import { useSelector } from 'react-redux';
import { RootState } from '../redux/types';
import { Navigate } from 'react-router-dom';

const Shimmers = () => {

  const access_token = useSelector((store: RootState) => store.auth.access_token)

  if(!access_token) return(<Navigate to="/signup" />)
  
  return (
    <div>
      {" "}
      <div className="flex justify-center pt-24">
        <div>
          <BlogShimmer />
          <BlogShimmer />
          <BlogShimmer />
          <BlogShimmer />
          <BlogShimmer />
          <BlogShimmer />
          <BlogShimmer />
          <BlogShimmer />
          <BlogShimmer />
          <BlogShimmer />
          <BlogShimmer />
        </div>
      </div>
    </div>
  );
};

export default Shimmers;
