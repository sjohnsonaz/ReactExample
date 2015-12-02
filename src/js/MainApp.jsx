import ReactDom from 'react-dom';
import Application from "./Application.jsx";

export default class MainApp {
    constructor() {
        this.test = 1;
    }
}

ReactDOM.render((
    <Application />
), document.getElementById('content'));
