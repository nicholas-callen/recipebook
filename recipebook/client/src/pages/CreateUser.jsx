import { React, useState } from "react";
import styled from 'styled-components';

function CreateUser() {

  const [addName, setName] = useState("");
  const [addPass, setPass] = useState("");
  //const [addStatus, setStatus] = useState("");
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    const createInfo = {
      username: addName,
      password: addPass,
    };

    //console.log(createInfo);
    const result = await fetch (
      'http://localhost:8000/createuser/' + createInfo.username + '/password/' + createInfo.password, {
        method: 'GET',
      }
    );

    if (result === true) {
      //setStatus("Successfully created user. Please nagivate to home page")
      console.log("Successfully created user");
    }
    else {
      //setStatus("Failure: Username already taken")
      console.log("Failed to create user");
    }
  };

  return(
    <StyledField>
      <h3>Hello</h3>
      <input  type="text" name="username"
        placeholder="Username"
        value={addName}
        onChange={(e) => setName(e.target.value)}
      />
      <input  type="text" name="password"
        placeholder="password"
        value={addPass}
        onChange={(e) => setPass(e.target.value)}
      />
      <button type="button" onClick={handleSubmit}>Submit</button>
    </StyledField>
  );
};

/*
<Popup trigger={<button type="button" onClick={handleSubmit}>Submit</button>}>
          <div>{addStatus}</div>
      </Popup>
      */
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

export default CreateUser;