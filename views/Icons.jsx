import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';
import Element from './Element';

const Icons = (props) => {
  const renderIcons = () => props.icons.map(icon => {
    return (
      <div 
        key={icon.iconSlug}
        data-slug={icon.iconSlug} 
        data-name={icon.name} 
        data-premium={icon.premium}
        className="edit-icon__item">
        <div className="panel panel-default">
          <header className="panel-heading edit-icon__header">
            <h3 className="panel-title">
              {icon.iconSlug}{' '}
              { icon.premium && (
                <span className="label label-warning">Premium</span>
              )}
            </h3>
            <div className="btn-group" role="group">
              <a href={`/edit/${icon.iconSlug}`} className="btn btn-default">Edit</a>
              <a 
                href={`/delete/${icon.iconSlug}`} 
                data-icon={icon.iconSlug}
                className="btn btn-default deleteIconButton">Delete</a>
            </div>
          </header>
          <div className="panel-body">
            <div className="ae-grid">
              <div className="ae-grid__item item-sm-6">
                <div className="edit-icon__icon">
                  <Element obj={icon.paths} />
                </div>
              </div>
              <div className="ae-grid__item item-sm-6 item-sm--center">
                <div className="well">
                  <p>Name: <b>{icon.name}</b></p>
                  <p>Style: <b>{icon.style}</b></p>
                  <span>Tags:</span>
                  <ul className="IconTags">
                    {icon.tags.map(tag => <li><span className="label label-info" key={tag}>{tag}</span></li>)}
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
          <footer className="panel-footer"></footer>
        </div>
      </div>
  )});

  const mainTitle = props.icons ? props.pack : 'Packs';

  return (
    <DefaultLayout {...props}>
      <input type="checkbox" id="edit-layout" />
      <header className="edit-page__header">
        <h1>
          <a href="/admin" className="btn btn-info btn-xs">&lt;</a>{' '}
          {mainTitle} <small className="badge">{props.icons.length} icons</small>
        </h1>
        <div className="form-group">
          <input 
            id="search-icons"
            type="text" 
            className="form-control" 
            placeholder="Search" />
        </div>
        <div>
            <label className="edit-premium">
            <input type="checkbox" id="edit-premium" /> Premium
          </label>
          <label htmlFor="edit-layout" className="edit-layout" />
        </div>
      </header>
      <div className="edit-icon">
        
        { renderIcons() }
        
        <div className="edit-icon__noResults">
          <div className="panel panel-default">
            <header className="panel-heading edit-icon__header">
              <h3 className="panel-title">
                No icons
              </h3>
            </header>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

module.exports = Icons;
