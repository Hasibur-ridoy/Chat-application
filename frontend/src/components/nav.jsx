import React from 'react';


const Nav = ({onLogout}) => {
  return (
    <nav className="bg-gray-800 p-4 fixed top-0 left-0 w-full z-10 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">MyApp</div>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"> Logout </button>
      </div>
    </nav>
  );
}

export default Nav;