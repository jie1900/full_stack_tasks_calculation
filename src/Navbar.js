import { Link } from 'react-router-dom';
import './Header.css';

export default function Navbar() {
    return (
        <nav className="nav">
            <Link to="/items" className="site-title">
                <span className="material-symbols-outlined nav-icon">
                    add_task
                </span>
                Items
            </Link>
            <ul>
                <li>
                    <span className="material-symbols-outlined nav-icon">
                        work_history
                    </span>
                    <Link to="/task_active" className="nav-text">Task Activity</Link>
                </li>
                <li>
                    <span className="material-symbols-outlined nav-icon">
                        help
                    </span>
                    <Link to="/Info" className="nav-text">Info</Link>
                </li>
            </ul>
        </nav>
    );
}
