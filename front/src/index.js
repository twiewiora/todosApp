import ReactDOM from 'react-dom';
import Pager from 'react-subpage';
import './Styles/index.css';
import App from './App';
import Calendar from './Calendar';
import registerServiceWorker from './registerServiceWorker';

const urlMap = {
    '/'            : App,
    '/calendar'    : Calendar,
}
const pager = new Pager(urlMap);

ReactDOM.render(pager.element, document.getElementById('root'));
registerServiceWorker();
