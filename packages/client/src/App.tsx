import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Landing from "./views/Landing";
import Game from "./views/Game";
import Play from "./views/Play";
import { createGlobalStyle } from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface StyleProps {
  darkMode: boolean;
}

const GlobalStyle = createGlobalStyle<StyleProps>`
  html {
    min-height: 100%;
  }

  body {
    font-family: 'Carter One', cursive;
    //background-color: ${(props) => (props.darkMode ? "black" : "yellow")};
    background-color: #6EC5B8;
  }
`;

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/play/:roomCode/:username" component={Play} />
          <Route path="/game" component={Game} />
          <Route path="/" component={Landing} />
        </Switch>
      </BrowserRouter>
      <ToastContainer />
      <GlobalStyle darkMode={false} />
    </>
  );
}

export default App;
