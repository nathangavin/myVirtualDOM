import { Component, hyperscript as h } from './vDOM.js';

import People from './People.js';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render(props) {
        return h('div', 
            {class: 'app'}, 
            h('h1', 
                null, 
                'Simple vDOM'),
            h(People));
    }
}

export default App;
