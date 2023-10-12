import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useLoginContext } from "../LoginContext";
import {FaSearch} from 'react-icons/fa';
import {BrowserRouter, Link} from 'react-router-dom';

import React from 'react';

function RecipeDB() {

  let login = useLoginContext();
  let { name } = useParams();
  const [details, setDetails] = useState({});
  const [instructions, setInstructions] = useState("");
  const [activeTab, setActiveTab] = useState("instructions");
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState();
  const [id, setId] = useState();
  const [time, setTime] = useState("");
  const [skill, setSkill] = useState("");

  const submitHandler = async(e) => {
    e.preventDefault();
    // API REQUEST
    const result = await fetch(
      'http://localhost:8000/substitutions/' + input
    );

    const data = await result.json();
    console.log(result);
    if (data.options === "") {
      setIngredients("Sorry, substitute unavailable.");
    }
    else {
      setIngredients(data.options);
    }
    console.log(data.options);
  }

  const fetchDetails = async () => {
    let data = {};
    if (login.username === "") {
      data = await fetch(
        'http://localhost:8000/recipes/' + name, {
          method: 'GET',
        }
      ); // REPLACE WITH GET FROM DB
    }
    else {
      data = await fetch(
        'http://localhost:8000/user/' + login.username + '/recipes/' + name, {
          method: 'GET',
        }
      );
    }
    const detailData = await data.json();
    setDetails(detailData);
    setTime("Time: " + detailData.time.low + "-" + detailData.time.high + " minutes");
    if (detailData.skill.easy)
      setSkill("Skill Level: Easy");
    else if (detailData.skill.medium)
      setSkill("Skill Level: Medium");
    else {
      setSkill("Skill Level: Hard");
    }
    console.log(detailData);
    setInstructions(detailData.instructions.map(instruction => instruction.trim()).join("\n"));
    setId(detailData._id);
  };

  const updateGroup = async(number) => {
    
    const result = await fetch(
      'http://localhost:8000/user/' + login.username + '/addtogroup/' + number + '/' + name, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details)
      }
    ).then(console.log(details));

    /*
    const test = await fetch(
      'http://localhost:8000/user/' + login.username + '/group/' + number, {
        method: 'GET'
      }
    );
    let testing = await test.json();
    */
  }

  useEffect(() => {
    fetchDetails();
  }, [name]);

  if (login.username ===""){
    return (
      <DetailWrapper>
        <div>
          <h3>{details.name}</h3>
        </div>
        <Info>
          <Button 
            className={activeTab==='instructions' ? 'active' : ''}
            onClick={() => setActiveTab('instructions')}
          >
            Instructions
          </Button>
          <Button 
            className={activeTab==='ingredients' ? 'active' : ''}
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
            </Button>
          <Button 
            className={activeTab==='notes' ? 'active' : ''}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </Button>
          {activeTab === 'instructions' && (
            <ul>
              <h2>{time}</h2>
              <h2>{skill}</h2>
              <li>{instructions}</li>
            </ul>
          )}
          {activeTab === 'ingredients' && (
            <ul>
              {details.ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
              <FormStyle onSubmit={submitHandler}>
                <div>
                  <FaSearch />
                  <input
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder="Search for a replacement ingredient:"
                    value={input}
                  /> 
                </div>
                <StyledField type="text" name="ingredients"
                  placeholder="Replacement ingredients:"
                  value={ingredients}
                  readOnly={true}
                />
              </FormStyle>
            </ul>
          )}
          {activeTab === 'notes' && (
            <ul>
              <h3>Author: {details.author} </h3>
              <h2>Cuisine type: {details.cuisine.map(cui => cui.trim()).join('/')}</h2>
              <h2>Tags: {details.tags.map(tag => tag.trim()).join(', ')}</h2>
              <h2>Notes: </h2>
              <li>{details.notes}</li>
              {details.restrictions.vegetarian === true && 
                <li>Vegetarian</li>
              }
              {details.restrictions.gluten_free === true && 
                <li>Gluten Free</li>
              }
              {details.restrictions.dairy_free === true && 
                <li>Dairy Free</li>
              }
            </ul>
          )}
        </Info>
      </DetailWrapper>
    );
  }
  else {
    return (
      <DetailWrapper>
        <div>
          <h3>{details.name}</h3>
          <Grid>
            <AddButton onClick={() => updateGroup(0)}>Add to Group 1</AddButton>
            <AddButton onClick={() => updateGroup(1)}>Add to Group 2</AddButton>
            <AddButton onClick={() => updateGroup(2)}>Add to Group 3</AddButton>
            <AddButton onClick={() => updateGroup(3)}>Add to Group 4</AddButton>
          </Grid>
          <EditButton to={'/editrecipe/' + id}>Edit Recipe</EditButton>
        </div>
        <Info>
          <Button 
            className={activeTab==='instructions' ? 'active' : ''}
            onClick={() => setActiveTab('instructions')}
          >
            Instructions
          </Button>
          <Button 
            className={activeTab==='ingredients' ? 'active' : ''}
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </Button>
          <Button 
            className={activeTab==='notes' ? 'active' : ''}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </Button>
            {activeTab === 'instructions' && (
              <ul>
                <h2>{time}</h2>
                <h2>{skill}</h2>
                <li>{instructions}</li>
              </ul>
          )}
          {activeTab === 'ingredients' && (
            <ul>
              {details.ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
              <FormStyle onSubmit={submitHandler}>
                <div>
                  <FaSearch />
                  <input
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder="Search for a replacement ingredient:"
                    value={input}
                  /> 
                </div>
                <StyledField type="text" name="ingredients"
                  placeholder="Replacement ingredients:"
                  value={ingredients}
                  readOnly={true}
                />
              </FormStyle>
            </ul>
          )}
          {activeTab === 'notes' && (
            <ul>
              <h3>Author: {details.author} </h3>
              <h2>Cuisine type: {details.cuisine.map(cui => cui.trim()).join('/')}</h2>
              <h2>Tags: {details.tags.map(tag => tag.trim()).join(', ')}</h2>
              <h2>Notes: </h2>
              <li>{details.notes}</li>
              {details.restrictions.vegetarian === true && 
                <li>Vegetarian</li>
              }
              {details.restrictions.gluten_free === true && 
                <li>Gluten Free</li>
              }
              {details.restrictions.dairy_free === true && 
                <li>Dairy Free</li>
              }
            </ul>
          )}
        </Info>
      </DetailWrapper>
    );
  }
}

const EditButton = styled(Link)`
  display: flex;
  text-decoration: none;
  font-size: 3rem;
  width: 100%;
  height: 8rem;
  padding: 1rem;
  justify-content: center;
  align-items: center;
  border-radius: 2rem;
  background: linear-gradient(35deg, #494949, #313131);
  color: white;
  cursor: pointer;
  &:hover {
    background: #e94057;
  }
`;

const Grid = styled.div`
  padding: 1rem 0rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  svg {
    font-size: 2rem;
  }
`;

const AddButton = styled.button`
  display: flex;
  text-decoration: none;
  font-size: 1.5rem;
  width: 25%;
  height: 8rem;
  padding: 1rem;
  justify-content: center;
  align-items: center;
  border-radius: 2rem;
  background: linear-gradient(35deg, #494949, #313131);
  color: white;
  cursor: pointer;
  &:hover {
    background: #e94057;
  }
`;

const StyledField = styled.textarea`
  margin: 1rem 0rem;
  background: BlanchedAlmond;
  width: 100%;
  height: 5rem;
  padding: 1rem 1rem;
  border: none;
  border-radius: 1rem;
  font-size: 1.5rem;
`;

const FormStyle = styled.form`
  margin: 0rem 0rem;
  div {
    width: 100%;
    position: relative;
  }
  input {
    border: none;
    background: linear-gradient(35deg, #494949, #313131);
    font-size: 1.5rem;
    color: white;
    padding: 1rem 3rem;
    border: none;
    border-radius: 1rem;
    outline: none;
    width: 100%
  }
  svg {
    position: absolute;
    top: 50%;
    left: 0%;
    transform: translate(100%, -50%);
    color: white;
  }
`;

const DetailWrapper = styled.div`
  margin-top: 10rem;
  margin-bottom: 5rem;
  display: flex;
  .active{
    background: linear-gradient(35deg, #494949, #313131);
    color: white;
  }
  h2 {
    margin-bottom: 2rem;
  }
  li {
    font-size: 1.2rem;
    line-height: 2.5rem;
  }
  ul {
    margin-top: 2rem;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  color: #313131;
  background: white;
  border: 2px solid black;
  margin-right: 2rem;
  font-weight: 600;
`;

const Info = styled.div`
  margin-left: 10rem;
`;

export default RecipeDB