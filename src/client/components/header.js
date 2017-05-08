import React from 'react';

export default class Header extends React.Component {
  render () {
    let name = 'PODCHAIN'.split('').map(char =>
      <span className={char} key={char}> {char}</span>
    );
    return (
      <div className='header'>
        <div className='header-center-vertically'>{name}</div>
      </div>
    );
  }
}
