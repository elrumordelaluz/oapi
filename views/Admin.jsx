import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';
import Element from './Element';

const Admin = (props) => {
  const packsKeys = Object.keys(props.packs);
  
  const renderPacks = () => packsKeys.map(pack => (
    <li key={pack}>
      <a href={'/pack/' + pack}>{pack} <mark>{props.packs[pack]}</mark></a>
    </li>
  ));
  
  return (
    <DefaultLayout {...props}>
      <h2>Orion Library Admin</h2>
      
      <hr/>
      
      <h3>Packs <small><mark>{packsKeys.length}</mark></small></h3>
      <ul>
        { renderPacks() }
      </ul>
    </DefaultLayout>
  );
}

module.exports = Admin;
