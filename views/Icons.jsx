import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';

const Icons = (props) => {
  const renderPacks = () => props.packs.map(pack => (
    <li key={pack}>
      <a href={'/pack/' + pack}>{pack}</a>
    </li>
  ));

  const renderIcons = () => props.icons.map(icon => (
    <li key={icon.iconSlug}>
      <h3>{icon.name}</h3>
    </li>
  ));

  return (
    <DefaultLayout {...props}>
      <h1>{props.icons && props.pack && `${props.pack} icons`}</h1>
      <h1>{props.packs && 'Packs'}</h1>
      <ul>
        { props.icons && renderIcons() }
        { props.packs && renderPacks() }
      </ul>

    </DefaultLayout>
  );
}

module.exports = Icons;
