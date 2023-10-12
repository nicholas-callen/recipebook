import { React, useState, Component, useEffect } from "react";
import styled from 'styled-components';
import { useParams } from "react-router-dom";
import { useLoginContext } from "../LoginContext";


function EditRecipe() {

  let login = useLoginContext();
  const [details, setDetails] = useState({});
  //const [addIngredients, setIngredients] = useState({});
  const [ingredStr, setIngredStr] = useState("");
  //const [addInstructions, setInstructions] = useState({});
  const [instStr, setInstStr] = useState("");
  //const [addNotes, setNotes] = useState({});
  const [notesStr, setNotesStr] = useState("");
  let params = useParams();

  const fetchDetails = async () => {
    const data = await fetch(
      'http://localhost:8000/recipes/' + params.name, {
        method: 'GET',
      }
    ); // REPLACE WITH GET FROM DB
    const detailData = await data.json();
    setDetails(detailData);
    //setIngredients(detailData.ingredients);
    setIngredStr(detailData.ingredients.map(ingredient => ingredient.trim()).join('\n'));
    //setInstructions(detailData.instructions);
    setInstStr(detailData.instructions.map(instruction => instruction.trim()).join('\n'));
    //setNotes(detailData.notes);
    setNotesStr(detailData.notes.map(note => note.trim()).join('\n'));
    console.log(detailData);
  };

  useEffect(() => {
    fetchDetails();
  }, [params.name]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const recipedata = {
      name: details.name,
      author: details.author,
      ingredients: ingredStr.split('\n').map(elements => elements.trim()),
      instructions: instStr.split('\n').map(elements => elements.trim()),
      cuisine: details.cuisine,
      notes: notesStr.split('\n').map(elements => elements.trim()),
      tags: details.tags,
      time: details.time,
      skill: details.skill,
      restrictions: details.restrictions,
    };

    console.log(recipedata);
    
    await fetch("http://localhost:8000/" + login.username + '/editrecipe', { // need to rename to actual endpoint later
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipedata)
    }).then(console.log(recipedata));
  }
/*
  return(
    <h1>Hello</h1>
  )
  */
/*
  return (
    <StyledField>
      <h4>Edit Recipe:</h4>
      <ColoredLine color="black" />
      <h2>Please note all fields must be filled</h2>
      <h4>Separate with newline characters</h4>
      <textarea type="text" name="ingredients"
        value={addIngredients.map(ingredient => ingredient.trim()).join('\n')}
        onChange={(e) => setIngredients(e.target.value.split('\n').map(elements => elements.trim()))}
      />
      <h4>Separate with newline characters</h4>
      <textarea type="text" name="instructions"
        value={addInstructions.map(instruction => instruction.trim()).join('\n')}
        onChange={(e) => setInstructions(e.target.value.split('\n').map(elements => elements.trim()))}
      />
      <h4>Separate with newline characters</h4>
      <textarea type="text" name="notes"
        placeholder="Additional notes"
        value={addNotes.map(note => note.trim()).join('\n')}
        onChange={(e) => setNotes(e.target.value.split('\n').map(elements => elements.trim()))}
      />
      <button type="button" onClick={handleSubmit}>Submit</button>
    </StyledField>
  )
  */

  if (login.username==="") {
    return (
      <h3>Sorry, please log in to edit this recipe</h3>
    )
  }
  else {
    return (
      <StyledField>
        <h4>Edit Recipe:</h4>
        <ColoredLine color="black" />
        <h2>Please note all fields must be filled</h2>
        <h2>Ingredients (Separate with newline characters):</h2>
        <textarea type="text" name="ingredients"
          value={ingredStr}
          onChange={(e) => setIngredStr(e.target.value)}
        />
        <h2>Instructions (Separate with newline characters):</h2>
        <textarea type="text" name="instructions"
          value={instStr}
          onChange={(e) => setInstStr(e.target.value)}
        />
        <h2>Notes (Separate with newline characters):</h2>
        <textarea type="text" name="notes"
          value={notesStr}
          onChange={(e) => setNotesStr(e.target.value)}
        />
        <button type="button" onClick={handleSubmit}>Submit</button>
      </StyledField>
    )
  }
};

const ColoredLine = ({ color }) => (
  <hr
    style={{
      margin: 10,
      color: color,
      backgroundColor: color,
      height: 3
    }}
  />
);

const StyledField = styled.form`
  margin: rem 0rem;
  div {
    width: 100%;
    position: relative;
  }
  input {
    margin: 0.5rem 0rem;
    background: BlanchedAlmond;
    font-size: 1rem;
    color: black;
    padding: 1rem 1rem;
    border: none;
    border-radius: 1rem;
    outline: none;
    width: 75%;
  }
  textarea {
    margin: 0.5rem 0rem;
    background: BlanchedAlmond;
    width: 100%;
    height: 10rem;
    padding: 1rem 1rem;
    border: none;
    border-radius: 1rem;
    font-size: 1rem;
  }
`;

export default EditRecipe;