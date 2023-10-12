import React from 'react'
import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import styled from 'styled-components';
import { useLoginContext } from "../LoginContext";


function Searched() {

  let login = useLoginContext();
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const [searchedRecipesDB, setSearchedRecipesDB] = useState([]);
  let params = useParams();

  const getSearched = async (name) => {
    console.log(name);
    const data = await fetch(
      'https://api.spoonacular.com/recipes/complexSearch?apiKey=5815fa810a994a868df0392def7934bc&query=' + name
    ); // REPLACE WITH QUERY DB
    const recipes = await data.json();
    console.log(recipes);
    setSearchedRecipes(recipes.results);
  };

  const getSearchedDB = async (name) => {
    console.log(name);
    let data = {}
    if(login.username==="")  {
      data = await fetch(
        'http://localhost:8000/searchrecipes/' + name
      );
    }
    else {
      data = await fetch(
        'http://localhost:8000/user/' + login.username + '/searchrecipes/' + name
      );
    }
    //console.log(data);
    const recipes = await data.json();
    setSearchedRecipesDB(recipes);
    //console.log(recipes);
  };
  
  useEffect(() => {
    let query = params.search;
    console.log(query);
    getSearched(query);
    getSearchedDB(query);
  }, [params.search]); //          every time params.search is updated

  return (
    <div>
    <Grid>
      {searchedRecipes.map((item) => {
        return (
          <Card key={item.id}>
            <Link to={'/recipe/' + item.id}>
              <img src={item.image} alt='' />
              <h4>{item.title}</h4>
            </Link>
          </Card>
        )
      })}
    </Grid>
    <Grid>
      {searchedRecipesDB.map((item) => {
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
    
  )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-gap: 3rem;
`;

const Card = styled.div`
  img {
    width: 100%;
    border-radius: 2rem;
  }
  a {
    text-decoration: none;
  }
  h4 {
    text-align: center;
    padding: 1rem;
  }
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

export default Searched;