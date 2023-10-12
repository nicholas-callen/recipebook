import { React, useState, Component, useEffect } from "react";
import styled from 'styled-components';
import { useLoginContext } from "../LoginContext";

function AddRecipe () {
  const login = useLoginContext();
  const [addName, setName] = useState("");
  const [addAuthor, setAuthor] = useState("");
  const [addIngredients, setIngredients] = useState("");
  const [addInstructions, setInstructions] = useState("");
  const [addCuisine, setCuisine] = useState(""); 
  const [addNotes, setNotes] = useState("");
  const [addTags, setTags] = useState("");
  const [addMinTime, setMinTime] = useState(0)
  const [addMaxTime, setMaxTime] = useState(0)
  const [addSkill, setSkill] = useState("easy");
  const [addVegetarian, setVegetarian] = useState(false)
  const [addGluten, setGluten] = useState(false);
  const [addDairy, setDairy] = useState(false);

  const handleSkill = e => {
    setSkill(e.target.value);
  };

  const interpretSkill = () => {
    let tempSkill = addSkill;
    if (tempSkill === "easy") {
      return { easy: true, medium: false, hard: false };
    }
    else if (tempSkill === "medium") {
      return { easy: false, medium: true, hard: false };
    }
    else {
      return { easy: false, medium: false, hard: true };
    }
  };

  const interpretRestrictions = () => {
    return { vegetarian: addVegetarian, gluten_free: addGluten, dairy_free: addDairy };
  }

  const interpretTime = () => {
    return { low: addMinTime, high: addMaxTime };
  }

  const handleSubmit = e => {
    e.preventDefault();
    const recipedata = {
      name: addName,
      author: addAuthor,
      ingredients: addIngredients.split('\n').map(elements => elements.trim()),
      instructions: addInstructions.split('\n').map(elements => elements.trim()),
      cuisine: addCuisine.split(',').map(elements => elements.trim()),
      notes: addNotes.split('\n').map(elements => elements.trim()),
      tags: addTags.split(',').map(elements => elements.trim()),
      time: interpretTime(),
      skill: interpretSkill(),
      restrictions: interpretRestrictions(),
    };
    fetch("http://localhost:8000/", { // need to rename to actual endpoint later
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipedata)
    }).then(console.log(recipedata));
    if (!(login.username==="")) {
      fetch("http://localhost:8000/" + login.username, { // need to rename to actual endpoint later
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipedata)
      }).then(console.log(recipedata));
    }
  }

  return (
    <StyledField>
      <h4>ADD RECIPE INFORMATION</h4>
      <ColoredLine color="black" />
      <h2>Please note all fields marked with a * are mandatory</h2>
      <input  type="text" name="name"
        placeholder="Recipe Name*"
        value={addName}
        onChange={(e) => setName(e.target.value)}
      />
      <input type="text" name="author"
        placeholder="Author Name"
        value={addAuthor}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input type="text" name="cuisine"
        placeholder="Cuisine type (ex: Japanese, Korean) - separate with commas*"
        value={addCuisine}
        onChange={(e) => setCuisine(e.target.value)}
      />
      <textarea type="text" name="ingredients"
        placeholder="Ingredients - separate with new lines*"
        value={addIngredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <textarea type="text" name="instructions"
        placeholder="Instructions (please separate with a newline character)*"
        value={addInstructions}
        onChange={(e) => setInstructions(e.target.value)}
      />
      <textarea type="text" name="notes"
        placeholder="Additional notes"
        value={addNotes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <input type="text" name="tags"
        placeholder="Tags - separate with commas*"
        value={addTags}
        onChange={(e) => setTags(e.target.value)}
      />

      <input type="number" id="lowTime"
        placeholder="Minimum cook time (mins)*"
        onChange={(e) => setMinTime(e.target.value)}
      />
      <input type="number" id="highTime"
        placeholder="Maximum cook time (mins)*"
        onChange={(e) => setMaxTime(e.target.value)}
      />

      <h2>Recipe Skill Level:</h2>
      <div onChange={handleSkill}>
        <input type="radio" name="skill" value="easy" id="easy" defaultChecked={addSkill === "easy"} />
        <label htmlFor="easy">Easy</label>
        <input type="radio" name="skill" value="medium" id="medium" defaultChecked={addSkill === "medium"} />
        <label htmlFor="medium">Medium</label>
        <input type="radio" name="skill" value="hard" id="hard" defaultChecked={addSkill === "hard"} />
        <label htmlFor="hard">Hard</label>
      </div>

      <h2>Dietary Restrictions:</h2>
      <input type="checkbox" name="vegetarian"
        checked={addVegetarian}
        onChange={(e) => setVegetarian(e.target.checked)}
      />
      <label htmlFor="vegetarian">Vegetarian</label>
      <input type="checkbox" name="gluten-free"
        checked={addGluten}
        onChange={(e) => setGluten(e.target.checked)}
      />
      <label htmlFor="gluten-free">Gluten-Free</label>
      <input type="checkbox" name="dairy-free"
        checked={addDairy}
        onChange={(e) => setDairy(e.target.checked)}
      />
      <label htmlFor="dairy-free">Dairy-Free</label>

      <button type="button" onClick={handleSubmit}>Submit</button>
    </StyledField>
  )
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

export default AddRecipe;