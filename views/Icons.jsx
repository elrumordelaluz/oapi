import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';
import Element from './Element';

const Icons = (props) => {
  const renderIcons = () => props.icons.map(icon => {
    return (
      <div className="ae-grid__item item-sm-6">
        <div className="panel panel-default">
          <div className="panel-heading clearfix">
            <h3 className="panel-title pull-left">{icon.name}</h3>
            <div className="btn-group pull-right" role="group">
              <a href={`/edit/${icon.iconSlug}`} className="btn btn-info">Edit</a>
              <a 
                href={`/delete/${icon.iconSlug}`} 
                data-icon={icon.iconSlug}
                className="btn btn-danger deleteIconButton">Delete</a>
            </div>
          </div>
          <div className="panel-body">
            <div className="ae-grid">
              <div className="ae-grid__item item-sm-6">
                <Element obj={icon.paths} />
              </div>
              <div className="ae-grid__item item-sm-6">
                <p>Slug: <code>{icon.iconSlug}</code></p>
                <p>Style: <code>{icon.style}</code></p>
                <p>Premium: <code>{icon.premium ? 'yes' : 'no'}</code></p>
                <div>Tags:
                  <ul className="IconTags">
                    {icon.tags.map(tag => <li key={tag}><code>{tag}</code></li>)}
                  </ul>
                </div>
              </div>
            </div>
            <div className="ae-grid">
              <div className="ae-grid__item item-sm-12">
                <pre className="IconCode">
                  <code>
                    {JSON.stringify(icon.paths, null, 2)}
                  </code>
                </pre>
              </div>
            </div>
          </div>
          <div className="panel-footer">
            
          </div>


          
        </div>
      </div>
  )});

  const mainTitle = props.icons ? props.pack : 'Packs';

  return (
    <DefaultLayout {...props}>
      <div className="page-header">
        <h1>
          <a href="/admin" className="btn btn-info btn-xs">&lt;</a>{' '}
          {mainTitle} <small className="badge">{props.icons.length} icons</small></h1>
      </div>


      <div className="ae-grid">
        { renderIcons() }
      </div>
    </DefaultLayout>
  );
}

module.exports = Icons;
