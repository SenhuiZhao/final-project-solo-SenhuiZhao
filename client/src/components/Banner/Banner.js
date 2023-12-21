import React, { useState } from "react";
import './Banner.css'
import axios from "axios";
import { Link, useNavigate  } from 'react-router-dom';
import Profile from "../ProfilePage/ProfilePage";


// function DropdownMenu() {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleToggle = () => setIsOpen(!isOpen);

//   return (
//     <div className="dropdown text-end">
//       <a
//         href="#"
//         className="d-block link-dark text-decoration-none dropdown-toggle"
//         onClick={handleToggle}
//       >
//       </a>
//       {isOpen && (
//         <ul className="dropdown-menu text-small" aria-labelledby="dropdownMenuButton">
//           <li>
//             <a className="dropdown-item" href="#">
//               Profile
//             </a>
//           </li>
//           {/* <li>
//             <hr className="dropdown-divider" />
//           </li> */}
//           <li>
//             <a className="dropdown-item" href="#">
//               Sign out
//             </a>
//           </li>
//         </ul>
//       )}
//     </div>
//   );
// }

 function LoginAndSignupButtons( {userInfo}) {

  const navigate = useNavigate();

  const handleSignOut = () => {
    axios.get('http://localhost:8000/signout')
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        window.alert(error);
        console.log(error);
      });
  }

  if (!userInfo) {
  return (
    <div className="text-end">
      {/* <button type="button" className="btn-outline-light">Login</button> */}
      {/* <button type="button" className="btn-warning">Sign-up</button> */}
      <Link to="/welcome/LoginPage"><input type="button" className='btn-outline-light' value="Login" /></Link>
      <Link to="/welcome/SignUpPage"><input type="button" className='btn-warning' value="Sign-up" /></Link>
    </div>
  );}
  else {
    return (
      <div className="text-end">
        <Link to={`/welcome/HomePage/ProfilePage/${userInfo._id}`}><input type="button" className='btn-outline-light' value={userInfo.username} /></Link>
        <input type="button" className='btn-warning' value="Sign-out" onClick={handleSignOut} />
      </div>
    );
  }
}

function Banner({ model, setDisplayedQuestions, setPageTitle, userInfo }) {
  const [searchTerm, setSearchTerm] = useState("");
  // const [showProfile, setShowProfile] = useState(false);

  // console.log("userInfo", userInfo)
  // console.log("userInfoname", userInfo.username)
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEnterKeyDown = () => {
    const searchRegex = /\[(.*?)\]|(\b\w+\b)/g;
    let match;
    let tags = [];
    let words = [];

    while ((match = searchRegex.exec(searchTerm)) !== null) {

      if (match[1]) {
        tags.push(match[1]);
        console.log(match[1])
      } else {
        words.push(match[2]);

      }
    }
    console.log(words, tags)
    let filteredQuestions = model.questions.filter((question) => {
      const titleTextRegex = new RegExp(words.join("|"), "i");


      const titleMatch = question.title.match(titleTextRegex);
      const textMatch = question.text.match(titleTextRegex);


      const tagsWithNames = question.tags.map((tagId) => {
        const matchingTag = model.tags.find((t) => t._id === tagId);
        return matchingTag ? matchingTag.name : null;
      });
      // console.log("tagsWithNames ", tagsWithNames)
      console.log(titleMatch)

      const tagMatch =
        tags && tagsWithNames.some((tagName) => tags.includes(tagName));

      return ((titleMatch && titleMatch[0]) || (textMatch && textMatch[0])) || tagMatch;
    });
    console.log(!words)
    filteredQuestions = (words.length == 0 && tags.length == 0) ? model.questions : filteredQuestions
    setDisplayedQuestions(filteredQuestions);

    if (filteredQuestions.length === 0) {
      setPageTitle("No Questions Found");
    } else if (searchTerm === "") {
      setPageTitle("All Questions");
    } else {
      setPageTitle("Search Result");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleEnterKeyDown();
    }
  };

  return (
    <>
    <div className="banner">
      {/* <DropdownMenu /> */}
      <LoginAndSignupButtons  userInfo={userInfo}/>
      <h1>Fake Stack Overflow</h1>
      <input
        className="search-bar"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
      />
    </div>
    {/* {showProfile && <Profile userInfo={userInfo}/>} */}
    </>
  );
}

export default Banner;

export {LoginAndSignupButtons};