import React from 'react';
import './NavProfile.css';
const NavProfile = ({ setActiveLink, activeLink, isAdmin }) => {
    const handleLinkClick = (linkName) => {
        setActiveLink(linkName);
    };

    return (
        <>
            <div className="mainLeft">
                <ul className='nav-container'>
                {isAdmin && (
                        <li
                            className={activeLink === 'allUsers' ? 'active' : ''}
                            onClick={() => handleLinkClick('allUsers')}
                        >
                            All Users
                        </li>
                    )}
                    <li
                        className={activeLink === 'questions' ? 'active' : ''}
                        onClick={() => handleLinkClick('questions')}
                    >
                        Questions
                    </li>
                    <li
                        className={activeLink === 'tags' ? 'active' : ''}
                        onClick={() => handleLinkClick('tags')}
                    >
                        Tags
                    </li>
                    <li
                        className={activeLink === 'answers' ? 'active' : ''}
                        onClick={() => handleLinkClick('answers')}
                    >
                        Answers
                    </li>
                </ul>
            </div>
        </>
    );
};

export default NavProfile;
