import React from 'react';
import { useParams } from 'react-router-dom';

const RecipeView = () => {
  const params = useParams();
  return (
    <>recipe{params.id}</>
  );
}

export default RecipeView;