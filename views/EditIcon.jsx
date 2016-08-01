import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';
import Element from './Element';

const EditIcon = (props) => {
  const { icon } = props;
  const tags = icon.tags.join(", ");
  const spl = icon.iconSlug.split('_')
  const suffix = `_${spl[spl.length - 1]}`
  const slugNoSuffix = icon.iconSlug.replace(suffix, '')
  console.log(slugNoSuffix + suffix === icon.iconSlug);
  return (
    <DefaultLayout {...props}>
      <form action={`/edit/${icon.iconSlug}`} id="edit-single-icon" method="post">
        <div className="panel panel-default">
          <header className="panel-heading edit-icon__header">
            <h3 className="panel-title">
              <a 
                href={`/pack/${icon.packageSlug}`} 
                className="btn btn-default btn-xs">{icon.package}</a> {' '}
              {icon.iconSlug} {' '}<small>/Slug</small>
            </h3>
            <button role="submit" className="btn btn-info">Save</button>
          </header>
          
          <div className="panel-body">
            <div className="ae-grid">
              <div className="ae-grid__item item-sm-5">
                <div className="edit-icon__icon">
                  <Element obj={icon.paths} />
                </div>
              </div>
              <div className="ae-grid__item item-sm-7">
                <div className="form-group">
                  <label htmlFor="iconSlugNoSuffix">Icon Slug</label>
                  <label className="suffix-container">
                    <input 
                      type="text" 
                      className="form-control suffix-input" 
                      id="iconSlugNoSuffix" 
                      name="iconSlugNoSuffix" 
                      defaultValue={slugNoSuffix}
                      placeholder={slugNoSuffix} 
                      size={slugNoSuffix.length} />{suffix}
                    <input type="hidden" name="iconOnlySuffix" id="iconOnlySuffix" defaultValue={suffix} />
                    <input type="hidden" name="iconSlug" id="iconSlug" />
                  </label>
                </div>
                
                <div className="form-group">
                  <label htmlFor="iconName">Icon Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="iconName" 
                    name="iconName" 
                    defaultValue={icon.name}
                    placeholder={icon.name}/>
                </div>
                
                <div className="form-group">
                  <label htmlFor="iconStyle">Icon Style</label>
                  <select 
                    id="iconStyle" 
                    name="iconStyle" 
                    className="form-control" 
                    value={icon.style}>
                    <option value="stroke">Stroke</option>
                    <option value="fill">Fill</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Premium</label>
                  <div className="radio">
                    <label>
                      <input 
                        type="radio" 
                        name="iconPremium" 
                        id="iconPremiumTrue" 
                        value="true" 
                        checked={icon.premium} /> Yes
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input 
                        type="radio" 
                        name="iconPremium" 
                        id="iconPremiumFalse" 
                        value="false"
                        checked={!icon.premium} /> No
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="iconTags">Tags</label>
                  <input type="text" value={tags} id="iconTags" name="iconTags" data-role="tagsinput" />
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
          
          <footer className="panel-footer clearfix">
            <button role="submit" className="btn btn-info">Save</button>
          </footer>
        </div>
      </form>
      
      <form action={`/replace/${icon.iconSlug}`} className="form-inline">
        <div className="panel panel-danger">
          <header className="panel-heading edit-icon__header">
            <label className="panel-title" htmlFor="iconFile">Replace Icon File</label>
            <input type="file" id="iconFile" name="iconFile" required />
            <button className="btn btn-danger">Upload</button>
          </header>
        </div>
      </form>

    </DefaultLayout>
  );
}

module.exports = EditIcon;
