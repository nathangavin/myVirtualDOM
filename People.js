import { Component, hyperscript as h } from './vDOM.js';

class People extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: ['a', 'b', 'c', 'd', 'e']
        }

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        function getRandomItemFromArray(array) {
            return array[getRandomInt(0, array.length - 1)];
        }

        this.timer = setInterval(() => {
            this.setState({
                list: [...this.state.list, getRandomItemFromArray(this.state.list)]
            });
        }, 1000);
    }
    
    render(props, state) {
        return h(
            'ul', 
            null, 
            ...state.list.map(item => h('li', 
                                        null, 
                                        item)));
    }
}

export default People;