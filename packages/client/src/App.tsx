import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Landing from "./views/Landing";
import Game from "./views/Game";
import Play from "./views/Play";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/play/:roomCode/:username" component={Play} />
        <Route path="/game" component={Game} />
        <Route path="/" component={Landing} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
