import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';
import Element from './Element';

const EditIcon = (props) => {
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

      <form action={`/edit/${icon.iconSlug}`} method="post">
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
              <select value={icon.style} name="iconStyle" >
                <option value="stroke">Stroke</option>
                <option value="fill">Fill</option>
              </select>
            </div>

            <div className="EditContainer">
              Premium
              <div>
                <label>
                  Yes
                  <input type="radio" checked={icon.premium} value="true" name="iconPremium" />
                </label>
                <label>
                  No
                  <input type="radio" checked={!icon.premium} value="false" name="iconPremium" />
                </label>
              </div>
            </div>



            <label className="EditContainer">
              Tags
              <input type="text" value={tags} />
            </label>

          </div>

          <textarea rows="20" className="EditIconCode" defaultValue={JSON.stringify(icon.paths, null, 4)} />
        </div>

        <button className="btn btn-info">Save</button>
      </form>

    </DefaultLayout>
  );
}

module.exports = EditIcon;
