import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';
import Element from './Element';

const Icons = (props) => {
  const renderPacks = () => props.packs.map(pack => (
    <li key={pack}>
      <a href={'/pack/' + pack}>{pack}</a>
    </li>
  ));

  const renderIcons = () => props.icons.map(icon => {
    return (
    <li key={icon._id} className="Icon">

      <div className="IconPreview">
        <Element obj={icon.paths} />
      </div>

      <div className="IconDetails">
        <h3 className="IconTitle">{icon.name}</h3>
        <p>Slug: <code>{icon.iconSlug}</code></p>
        <p>Style: <code>{icon.style}</code></p>
        <p>Premium: <code>{icon.premium ? 'yes' : 'no'}</code></p>
        <div>Tags:
          <ul className="IconTags">
            {icon.tags.map(tag => <li key={tag}><code>{tag}</code></li>)}
          </ul>
        </div>
        <div className="IconActions">
          <a href={`/edit/${icon.iconSlug}`} className="btn btn-info">Edit</a>
          { /* <a href="#0" className="btn btn-warning">Delete</a> */ }
        </div>
      </div>

      <pre className="IconCode">
        <code>
          {JSON.stringify(icon.paths, null, 2)}
        </code>
      </pre>
    </li>
  )});

  const mainTitle = props.icons ? props.pack : 'Packs';

  return (
    <DefaultLayout {...props}>
      <h1 className="ListTitle">{mainTitle}</h1>

      { props.icons && <div className="EditIconPack">
        <a href="/packs/">Packs</a>
      </div> }

      <ul className="IconsList">
        { props.icons && renderIcons() }
        { props.packs && renderPacks() }
      </ul>

    </DefaultLayout>
  );
}

module.exports = Icons;
