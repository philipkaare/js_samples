import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LocalForage from '../node_modules/localforage/dist/localforage.js'
import Q from '../node_modules/q/q.js'
import _ from '../node_modules/underscore/underscore.js'
import {PersistentList} from './PersistentList.js'

class RenderList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (
        <div>
          <ul>
              {this.props.list.map(item => (
              <li>{item.name}</li>
            ))}
          </ul>
        </div>
      )
  }
}


class TodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.plist = new PersistentList("todo");
    this.state = {
      list: [],
      value: "",
      loading: true
    };
    this.addButtonClick = this.addButtonClick.bind(this);
    this.textChanged = this.textChanged.bind(this);
    this.clearButtonClick = this.clearButtonClick.bind(this);
  }

  textChanged(event) {
    this.setState({value: event.target.value});
  }

  handleError(err)
  {
    alert("An error occurred and we should handle it well. ");
    throw err;
  }

  componentDidMount()
  {
    var self = this;

    return this.plist.getAll()
      .then((list) =>
        {
          if (list)
            self.setState({list: list})
        }
      )
      .then(()=> Q.delay(1000))
      .then(()=> self.setState({loading: false}))
      .catch(self.handleError);
  }

  clearButtonClick(event)
  {
    LocalForage.clear().then(
      () => this.setState({list: []})
    );
  }

  addButtonClick(event) {
    if (!this.state.value)
      return;
    this.setState((prevState) => (
      {
        list: prevState.list.concat([{name: this.state.value}]),
        value: ""
      }
    ));
    this.plist.insert({name: this.state.value});
  }

  render() {
    return (
      <div>
        Todo:
        <input
          type="text"
          onChange={this.textChanged}
          value={this.state.value} />
        <input type="button" value="Add" onClick={this.addButtonClick} />
        <input type="button" value="Clear" onClick={this.clearButtonClick} />
        {(this.state.loading
            ? <div>Loading</div>
            : (
              <RenderList list={this.state.list} />
            )
        )}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Philips React todo-liste</h2>
        </div>
        <br />
        <TodoForm />
      </div>
    );
  }
}

export default App;
