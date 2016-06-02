import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';
import Element from './Element';

const Icon = (props) => {
  const { icon } = props;
  const tags = icon.tags.join(", ");
  return (
    <DefaultLayout {...props}>
      <div className="EditIconTitle">
        <input type="text" value={icon.name} />
      </div>

      <div className="EditIconPack">
        <a href={`/pack/${icon.packageSlug}`}>{icon.package}</a>
      </div>

    <div className="EditIconActions">
        <a href="#0" className="btn btn-info">Save</a>
        <a href="#0" className="btn btn-warning">Reset</a>
        <a href="#0" className="btn btn-danger">Delete</a>
      </div>

      <div className="Icon">
        <div className="IconPreview">
          <Element obj={icon.paths} />
        </div>

        <div className="EditIconDetails">

          <label className="EditContainer">
            Slug
            <input type="text" value={icon.iconSlug} disabled />
          </label>

          <div className="EditContainer">
            Style:
            <select value={icon.style}>
              <option value="stroke">Stroke</option>
              <option value="fill">Fill</option>
            </select>
          </div>

          <label className="EditContainer">
            Premium
            <input type="checkbox" checked={icon.premium ? true : false} />
          </label>

          <label className="EditContainer">
            Tags
            <input type="text" value={tags} />
          </label>

        </div>

        <textarea rows="20" className="EditIconCode">
            {JSON.stringify(icon.paths, null, 4)}
        </textarea>
      </div>

    </DefaultLayout>
  );
}

module.exports = Icon;
