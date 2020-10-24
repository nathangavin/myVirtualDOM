import { renderComponent } from './vDOM.js';

class Component {
    constructor(props) {
        this.props = props;
        this.state = {};
    }

    setState(state) {
        this.state = Object.assign({}, state);
        renderComponent(this);
    }
}

export default Component;