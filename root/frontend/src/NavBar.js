import React from 'react';
import './NavBar.css';
import {Link} from 'react-router-dom';


export default class Navbar extends React.Component {
 
    constructor(props){
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <nav>
                <div className="logo">
                    <h4>Karttademo</h4>
                </div>
                <ul className="nav-links">
                    <li>
                        <Link to="/map">Kartta</Link>
                    </li>
                    <li>
                        <Link to="/markers">Merkinnät</Link>
                    </li>
                </ul>
                <div className="burger">
                    <div className="line1"></div>
                    <div className="line2"></div>
                    <div className="line3"></div>
                </div>
            </nav>
        );
    }
}