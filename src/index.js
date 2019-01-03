import React, { Profiler } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Typeahead from "./App";
import * as serviceWorker from "./serviceWorker";

function onRender(...args) {
  console.log('onRender()', ...args);
}

fetch("/github-users-stats.json")
  .then(response => response.json())
  .then(json => {
    ReactDOM.render(
      <Profiler id="Typeahead" onRender={onRender}>
        <Typeahead users={json} />
      </Profiler>,
      document.getElementById("root")
    );
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
