import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';

const Icons = (props) => {
  const renderPacks = () => props.packs.map(pack => (
    <li key={pack}>
      <a href={'/pack/' + pack}>{pack}</a>
    </li>
  ));

  const renderIcons = () => props.icons.map(icon => {
    return (
    <li key={icon._id}>
      <h3>{icon.name}</h3>
      <p>Slug: <code>{icon.iconSlug}</code></p>
      <p>Style: <code>{icon.style}</code></p>
      <p>Premium: <code>{icon.premium ? 'yes' : 'no'}</code></p>
      <div>Tags:
        <ul>
          {icon.tags.map(tag => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
      <pre>
        <code>
          {JSON.stringify(icon.paths, null, 2)}
        </code>
      </pre>
    </li>
  )});

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
