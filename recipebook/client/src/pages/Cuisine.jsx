import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {motion} from 'framer-motion';
import {Link, useParams} from 'react-router-dom';
import { useLoginContext } from "../LoginContext";

function Cuisine() {

  let login = useLoginContext();
  const [cuisine, setCuisine] = useState([]);
  let {name} = useParams();
  
  /*
  const getCuisine = async (name) => {
    const data = await fetch(
      'https://api.spoonacular.com/recipes/complexSearch?apiKey=860072773b074da38c79004d91bbdf00&cuisine=italian'
    );
    const recipes = await data.json();
    console.log(recipes);
    setCuisine(recipes.results);
  };
  */

  const getCollection = async (name) => {
    const data = await fetch(
      'http://localhost:8000/user/' + login.username + '/group/' + name
    );
    console.log(data);
    const recipes = await data.json();
    console.log(recipes);
    setCuisine(recipes);
  }

  useEffect (() => {
    getCollection(name);
    console.log(name);
  }, [name]);

  return (
    <div>
    <Grid>
      {cuisine.map((item) => {
        return (
          <CardDB key={item._id}>
            <Link to={'/recipedb/' + item._id}>
              <h4>{item.name}</h4>
            </Link>
          </CardDB>
        )
      })}
    </Grid>
    </div>
  );
}

/*

        
    
    */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-gap: 3rem;
`;

const CardDB = styled.div`
  background: BlanchedAlmond;
  a {
    text-decoration: none;
  }
  h4 {
    text-align: center;
    padding: 1rem;
  }
`;

export default Cuisine;