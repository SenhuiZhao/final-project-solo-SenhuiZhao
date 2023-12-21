import React from 'react';
import './Nav.css';

function Nav({activeLink, setActiveLink}) {
   
    // useEffect(() => {
    //     handleLinkClick(activeLink);
    //   }, [activeLink]);

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };
    return (
        <>
            <div className="mainLeft">
                <ul className='nav-container'>
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
                </ul>
            </div>
        </>
    );
}

export default Nav;
