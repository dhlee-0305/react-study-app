import "./App.css";
import React, { useState } from "react";
import {createStore} from "redux";
import {Provider, useSelector, useDispatch} from "react-redux";
import store from "./store";
import {up} from "./counterSlice";

function Header(props) {
  console.log("props", props);
  return (
    <div>
      <header>
        <h1>
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              props.onChangeMode();
            }}
          >
            {props.title}
          </a>
        </h1>
      </header>
    </div>
  );
}

function Nav(props) {
  const lis = [];
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(
      <li key={t.id}>
        <a
          id={t.id}
          href={"/read/" + t.id}
          onClick={(event) => {
            event.preventDefault();
            props.onChangeMode(Number(event.target.id));
          }}
        >
          {t.title}
        </a>{" "}
      </li>
    );
  }
  return (
    <nav>
      <ol>{lis}</ol>
    </nav>
  );
}

function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}

function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onCreate(title, body);
          console.log("Create():", title, body);
        }}
      >
        <p>
          <input type="text" name="title" placeholder="title"/>
        </p>
        <p>
          <textarea name="body" placeholder="body"></textarea>
        </p>
        <p>
          <input type="submit" value="Create" />
        </p>
      </form>
    </article>
  );
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  
  return (
    <article>
      <h2>Update</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          props.onUpdate(title, body);
          console.log("Update():", title, body);
        }}
      >
        <p>
          <input type="text" name="title" placeholder="title" value={title} onChange={event=>{
            setTitle(event.target.value);
          }}/>
        </p>
        <p>
          <textarea name="body" placeholder="body" value={body} onChange={event=>{
            setBody(event.target.value);
          }}></textarea>
        </p>
        <p>
          <input type="submit" value="Update" />
        </p>
      </form>
    </article>
  );
}

function Counter(){
  const dispatch = useDispatch();
  const count = useSelector( (state) => {
    console.log("Counter():state:", state);
    return state.counter.value;
  });
  return (
    <div>
      <button onClick={()=>{
        //dispatch({type:'counterSlice/up', step:2});
        //dispatch(counterSlice.actions.up(2))
        dispatch(up(2))
      }}>+</button> {count}
    </div>
  )
}
/*
function reducer(state, action){
  if(action.type === 'up'){
    return {...state, value:state.value+action.step};
  }
  return state;
}

createStore(reducer);
const initialState = {value:0};
const store = createStore(reducer, initialState);
*/

function App() {
  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    { id: 1, title: "html", body: "html is..." },
    { id: 2, title: "css", body: "css is..." },
    { id: 3, title: "javascript", body: "javascript is..." },
  ]);

  let content = null;
  let contextControl = null;

  if (mode === "WELCOME") {
    content = <Article title="Welcome" body="Hello, Web"></Article>;
  } else if (mode === "READ") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      console.log(topics[i].id, id);
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>;
    contextControl = (
      <>
        <li>
          <a
            href={"/update/" + id}
            onClick={(event) => {
              event.preventDefault();
              setMode("UPDATE");
            }}
          >
            Update
          </a>
        </li>
        <li><input type="button" value="Delete" onClick={()=>{
          const newTopics = []
          for(let i=0; i<topics.length; i++){
            if(topics[i].id !== id){
              newTopics.push(topics[i]);
            }
          }
          setTopics(newTopics);
          setMode("WELCOME");
        }}/></li>
      </>
    );
  } else if (mode === "CREATE") {
    content = (
      <Create
        onCreate={(_title, _body) => {
          const newTopic = { id: nextId, title: _title, body: _body };
          const newTopics = [...topics];
          newTopics.push(newTopic);
          setTopics(newTopics);
          console.log("App():newTopics:", newTopics);
          setMode("READ");
          setId(nextId);
          setNextId(nextId + 1);
        }}
      ></Create>
    );
  } else if (mode === "UPDATE") {
    let title,body = null;
    for (let i = 0; i < topics.length; i++) {
      console.log(topics[i].id, id);
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }

    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      console.log("App():Update():", title, body);
      const newTopics = [...topics];
      const updateTopic = {id:id, title:title, body:body};
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updateTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode("READ");
    }}></Update>;
  }

  return (
    <>
      <Header
        title="WEB"
        onChangeMode={() => {
          setMode("WELCOME");
        }}
      ></Header>

      <div>
        <Nav
          topics={topics}
          onChangeMode={(_id) => {
            setMode("READ");
            setId(_id);
          }}
        ></Nav>

        {content}

        <ul>
          <li>
            <a
              href="/create"
              onClick={(event) => {
                event.preventDefault();
                setMode("CREATE");
              }}
            >
              create
            </a>
          </li>

          {contextControl}
        </ul>
        <Provider store={store}>
          <div>
            <Counter></Counter>
          </div>
        </Provider>
      </div>
    </>
  );
}

export default App;
