import { React, useState, Component, useEffect } from "react";
import styled from 'styled-components';
import { LoginContext, useLoginContext } from "../LoginContext";
import Popup from 'reactjs-popup'

function Login() {

  const [addName, setName] = useState("");
  const [addPass, setPass] = useState("");
  const [trueName, setTrueName] = useState("");

  const login = useLoginContext();
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    const loginInfo = {
      username: addName,
      password: addPass,
    };

    //console.log(loginInfo);
    const result = await fetch (
      'http://localhost:8000/user/' + loginInfo.username + '/password/' + loginInfo.password, {
        method: 'GET',
      }
    );

    if (result) // login API endpoint returns true
    {
      login.changeUser(loginInfo.username);
      console.log("Success");
    }
    else
    {
      console.log("Failure");
    }
  };

  return(
    <StyledField>
      <h3>LOGIN:</h3>
      <ColoredLine color="black" />
      <input  type="text" name="username"
        placeholder="Username"
        value={addName}
        onChange={(e) => setName(e.target.value)}
      />
      <input  type="password" name="password"
        placeholder="password"
        value={addPass}
        onChange={(e) => setPass(e.target.value)}
      />
      <button type="button" onClick={handleSubmit}>Submit</button>
    </StyledField>
  );
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

export default Login;