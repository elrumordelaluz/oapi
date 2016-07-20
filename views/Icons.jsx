import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';
import Element from './Element';

const Icons = (props) => {
  const premiumLength = props.icons.filter(icon => icon.premium === true).length;
  const getPercentage = (base, num) => {
    return (num * 100 / base).toFixed(1)
  }
  const renderIcons = () => props.icons.map(icon => {
    return (
      <div 
        key={icon.iconSlug}
        data-slug={icon.iconSlug} 
        data-name={icon.name} 
        data-premium={icon.premium}
        className="edit-icon__item">
        <div className="panel panel-default">
          <input type="checkbox" className="select-input" id={`select_${icon.iconSlug}`} />
          <header className="panel-heading edit-icon__header">
            <h3 className="panel-title">
              <div className="edit-icon__icon--small">
                <Element obj={icon.paths} />
              </div>
              {icon.iconSlug}{' '}
              { icon.premium && (
                <span className="label label-warning">Premium</span>
              )}
            </h3>
            <div className="btn-group form-inline" role="group">
              <label className="btn btn-default select-label" htmlFor={`select_${icon.iconSlug}`}>
                select
              </label>
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
                    {icon.tags.map((tag, i) => <li><span className="label label-info" key={i}>{tag}</span></li>)}
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
          {mainTitle} 
          <small className="badge">{props.icons.length} icons</small>
          <span className="label label-warning badge-premium">
            <b>{premiumLength}</b>{' '}
            / {' '}{getPercentage(props.icons.length, premiumLength)}%
          </span>
        
        </h1>
        <div className="form-group">
          <input 
            id="search-icons"
            type="text" 
            className="form-control" 
            placeholder="Search" />
        </div>
        
        <form className="form-inline" id="bulkActions" action="/bulk">
          <button className="btn btn-link" id="selectAll">Select</button>
          <button className="btn btn-link" id="unselectAll">Unselect</button>{' '}
          <select className="form-control" id="select-bulkAction" defaultValue="0">
            <option value="0">Choose action...</option>
            <option value="1">Set Premium</option>
            <option value="3">Unset Premium</option>
            <option value="2">Delete</option>
          </select>{' '}
          <button type="submit" className="btn btn-default">Apply</button>
        </form>
        
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
      <a href="#top" className="backtotop-button">
        <svg viewBox="0 0 64 64"><path fill="currentColor" d="M43.2 38.1c-.6 0-1.1-.2-1.5-.7l-9.5-11.2-9.5 11.2c-.7.8-2 .9-2.8.2-.8-.7-.9-2-.2-2.8L32.2 20l12.5 14.8c.7.8.6 2.1-.2 2.8-.4.3-.9.5-1.3.5z"></path><path fill="currentColor" d="M32 64C14.4 64 0 49.6 0 32S14.4 0 32 0s32 14.4 32 32-14.4 32-32 32zm0-60C16.6 4 4 16.6 4 32s12.6 28 28 28 28-12.6 28-28S47.4 4 32 4z"></path></svg>
      </a>
    </DefaultLayout>
  );
}

module.exports = Icons;
