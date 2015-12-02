import React, {Component} from "react";
import HelloWorld from "./HelloWorld.jsx";

export default class Application extends Component {
    render() {
        return (
            <div>
                <h1>React Application</h1>
                <HelloWorld/>
            </div>
        );
    }
}
