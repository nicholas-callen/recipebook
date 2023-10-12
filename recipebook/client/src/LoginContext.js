import React, { createContext, useContext } from "react";

/*
export const LoginContext = React.createContext({
  username: "", // default value
});
*/

export const LoginContext = createContext();
export const {Provider} = LoginContext;

export const LoginContextProvider = ({ children }) => {
  const [username, setUsername] = React.useState("");
  const changeUser = (uname) => {
    setUsername(uname);
    console.log({username});
  }

  return (
    <LoginContext.Provider value={{username, changeUser}}>
      {children}
    </LoginContext.Provider>
  )

  /*
  useEffect( async() => {
    const result = await fetch (
      'http://localhost:8000/user/' + loginInfo.username + '/password/' + loginInfo.password, {
        method: 'GET',
      }
    );

    if (result) // login API endpoint returns true
    {

    }
  });
  */
}

export const useLoginContext = () => {

  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error ("useLoginContext used outside of Provider");
  }
  return context;
};