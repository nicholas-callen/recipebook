import Veggie from "../components/Veggie";
import Popular from "../components/Popular";
import { useContext } from "react";
import { LoginContext, useLoginContext } from "../LoginContext";
import React from 'react'
import UserRec from "../components/UserRec";

function Landing() {
  let login = useLoginContext();

  return (
    <div>
      <Popular />
      <UserRec />
    </div>
  )
}

export default Landing;