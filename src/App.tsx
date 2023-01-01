import React, { Component } from "react";
import { setInterval } from "timers";
import DataStreamer, { ServerRespond } from "./DataStreamer";
import Graph from "./Graph";
import "./App.css";

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[];
  //added state type for Graph toggle
  showGraph: boolean;
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      //setting intial state for Graph state toggle
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    //show Graph only when we trigger showGraph state to true 
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    //create interval to controll the data flow when time is escalating 
    let x = 0;
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server
        //on triggering this button change our state 
        //first set the response to the data that's passed to the Graph component
        //secont toggle the Graph state to render the component 
        this.setState({
          data: serverResponds,
          showGraph: true,
        });
      });

      x++;
      if (x > 1000) {
        clearInterval(interval);
      }
    }, 100);
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">Bank & Merge Co Task 2</header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {
              this.getDataFromServer();
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">{this.renderGraph()}</div>
        </div>
      </div>
    );
  }
}

export default App;
