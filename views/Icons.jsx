import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';
import Element from './Element';

const Icons = (props) => {
  const renderIcons = () => props.icons.map(icon => {
    return (
      <div className="edit-icon__item">
        <div className="panel panel-default">
          <header className="panel-heading edit-icon__header">
            <h3 className="panel-title">
              {icon.name}{' '}
              { icon.premium && (
                <span className="label label-warning">Premium</span>
              )}
            </h3>
            <div className="btn-group" role="group">
              <a href={`/edit/${icon.iconSlug}`} className="btn">Edit</a>
              <a 
                href={`/delete/${icon.iconSlug}`} 
                data-icon={icon.iconSlug}
                className="btn deleteIconButton">Delete</a>
            </div>
          </header>
          <div className="panel-body">
            <div className="ae-grid">
              <div className="ae-grid__item item-sm-6">
                <div className="edit-icon__icon">
                  <Element obj={icon.paths} />
                </div>
              </div>
              <div className="ae-grid__item item-sm-6">
                <p><b>iconSlug</b> <mark>{icon.iconSlug}</mark></p>
                <p><b>style</b>: <mark>{icon.style}</mark></p>
                <b>tags</b>:
                <ul className="IconTags">
                  {icon.tags.map(tag => <li><span className="label label-info" key={tag}>{tag}</span></li>)}
                </ul>
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
        <label htmlFor="edit-layout" className="edit-layout">
          view as
        </label>
      </header>
      <div className="edit-icon">
        { renderIcons() }
      </div>
    </DefaultLayout>
  );
}

module.exports = Icons;
