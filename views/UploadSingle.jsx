import React from 'react';

const packs = [
  'Interface',
  'Edition',
  'Communication',
  'Archives',
  'Media',
  'Hardware Software',
  'E-Commerce',
  'Social People',
  'Location',
  'Books Text',
  'Transportation',
  'Weather',
  'Food',
];

const UploadSingle = (props) => {
  return (
      <form action="/upload-single" method="post" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="iconName">Icon Name</label>
          <input type="text" className="form-control" id="iconName" name="iconName" placeholder="Icon Name" required />
        </div>  
        
        <div className="form-group">
          <label htmlFor="iconFile">Icon file</label>
          <input type="file" id="iconFile" name="iconFile" required />
          <p className="help-block">[ .svg ]</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="iconPack">Pack</label>
          <select id="iconPack" name="iconPack" className="form-control" required>
            <option disabled selected>Select a pack...</option>
            { packs.map(pack => <option value={pack} key={pack}>{pack}</option>) }
          </select>
        </div>
        
        <div className="form-group">
          <label>Style</label>
          <div className="radio">
            <label>
              <input type="radio" name="iconStyle" id="iconStyleStroke" value="stroke" defaultChecked />
              Stroked
            </label>
          </div>
          <div className="radio">
            <label>
              <input type="radio" name="iconStyle" id="iconStyleFill" value="fill" />
              Filled
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="iconTags">Tags</label> {' '}
          <input type="text" name="iconTags" id="iconTags" data-role="tagsinput" className="form-control" />
        </div>
        
        <div className="form-group">
          <label htmlFor="iconDesc">Description</label>
          <textarea id="iconDesc" name="iconDesc" placeholder="Lorem ipsum..." className="form-control" rows="3"></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="iconLib">Library</label>
          <input type="text" id="iconLib" name="iconLib" className="form-control" defaultValue="The Icon Set" />
        </div>
        
        <div className="checkbox">
          <label>
            <input type="checkbox" name="iconPremium" value="isPremium" /> <b>Premium?</b>
          </label>
        </div>
        
        <button className="btn btn-primary">Upload</button>
      </form>
  );
}

module.exports = UploadSingle;
