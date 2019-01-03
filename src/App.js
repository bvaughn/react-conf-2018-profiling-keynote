// eslint-disable-next-line no-unused-vars
import React, { useMemo, useState, memo } from "react";
import { unstable_trace as trace } from "scheduler/tracing";
import "./App.css";

/*** The flags below change the behvaior of the demo app ***/

// Use the useMemo() hook to memoize the Array filter and sort operation.
// This prevents it from being re-run unless the inputs change.
const FLAG_MEMOIZE_FILTER = true;

// Use React.memo() to memoize list items.
// This prevents them from re-rendering unless props change.
const FLAG_MEMOIZE_LIST_ITEM = true;

// Use the interaction tracing library for mor meaningful Profiling output.
const FLAG_TRACE_INTERACTIONS = true;

function sleep(ms) {
  const start = performance.now();
  while (performance.now() - start < ms) {
    // Loop
  }
}

function ListItem({ user }) {
  // Sleep long enough to ensure DevTools Profiler shows the component.
  // We do this to make the demo easier to understand.
  sleep(1);

  return (
    <li className="ListItem">
      <img className="ListItemImage" alt={user.name} src={user.gravatar} />
      <label className="ListItemLabel">{user.name}</label>
      <label className="ListItemLogin">({user.login})</label>
    </li>
  );
}

if (FLAG_MEMOIZE_LIST_ITEM) {
  ListItem = memo(ListItem);
}

function filterUsers(users, searchText) {
  if (searchText === "") {
    return [];
  }

  // Artificially slow things down.
  sleep(5);

  searchText = searchText.toLowerCase();

  return users
    .filter(
      item =>
        item.name.toLowerCase().startsWith(searchText) ||
        item.login.toLowerCase().startsWith(searchText)
    )
    .sort((a, b) => a.name.localeCompare(b.name));
}

function UserList({ maxNumToDisplay, users }) {
  // Show special message for an empty list:
  if (users.length === 0) {
    return (
      <ul className="List">
        <li className="ListItemSpecial">No results</li>
      </ul>
    );
  } else {
    // Render first N users:
    const numListItems = Math.min(users.length, maxNumToDisplay);
    const listItems = [];
    for (let i = 0; i < numListItems; i++) {
      const user = users[i];
      listItems.push(<ListItem key={user.login} user={user} />);
    }

    // Show a message if there were more users we didn't render:
    const numAdditionalUsers = users.length - numListItems;
    if (numAdditionalUsers > 0) {
      listItems.push(
        <li className="ListItemSpecial" key="And more">
          And {numAdditionalUsers} more...
        </li>
      );
    }

    return <ul className="List">{listItems}</ul>;
  }
}

function Typeahead({ users }) {
  // Search users whose names begin with this text:
  const [searchText, setSearchText] = useState("");
  function onSearchTextChange(event) {
    const newSearchText = event.currentTarget.value;
    if (!FLAG_TRACE_INTERACTIONS) {
      setSearchText(newSearchText);
    } else {
      trace(
        `searchText: ${searchText} -> ${newSearchText}`,
        performance.now(),
        () => setSearchText(newSearchText)
      );
    }
  }

  // Limit typeahead to only show this many results:
  const [numResults, setNumResults] = useState(5);
  function onNumResultsChange(event) {
    const newNumResults = event.currentTarget.value;
    if (!FLAG_TRACE_INTERACTIONS) {
      setNumResults(newNumResults);
    } else {
      trace(
        `numResults: ${numResults} -> ${newNumResults}`,
        performance.now(),
        () => setNumResults(newNumResults)
      );
    }
  }

  // Filter users (prop) by the current search text (state):
  const filteredUsers = FLAG_MEMOIZE_FILTER
    ? useMemo(() => filterUsers(users, searchText), [users, searchText])
    : filterUsers(users, searchText);

  return (
    <div className="App">
      <input
        className="SearchTextInput"
        onChange={onSearchTextChange}
        placeholder="Search text..."
        value={searchText}
      />
      <select
        className="NumResultsSelect"
        onChange={onNumResultsChange}
        value={numResults}
      >
        <option value={5}>Show first 5</option>
        <option value={10}>Show first 10</option>
        <option value={15}>Show first 15</option>
      </select>
      <UserList users={filteredUsers} maxNumToDisplay={numResults} />
    </div>
  );
}

export default Typeahead;
