import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';

import { toSlug } from '../helpers/index';

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

const Upload = (props) => {
  return (
    <DefaultLayout {...props}>
      <h1>Upload</h1>
      <form action="/upload" method="post" encType="multipart/form-data">
        <div className="form-group">
          <h4><label htmlFor="iconName">1. Icon Name</label></h4>
          <input type="text" className="form-control" id="iconName" name="iconName" placeholder="Icon Name" required />
        </div>  
        <div className="form-group">
          <h4><label htmlFor="iconFile">2. Icon file</label></h4>
          <input type="file" id="iconFile" name="iconFile" required />
          <p className="help-block">[ Only svg extension ]</p>
        </div>
        
        <div className="form-group">
          <h4><label htmlFor="iconPack">3. Pack</label></h4>
          <select id="iconPack" name="iconPack" className="form-control" defaultValue="0" required>
            <option disabled value="0">Select a pack...</option>
            { packs.map(pack => <option value={toSlug(pack)} key={pack}>{pack}</option>) }
          </select>
        </div>
        
        <div className="form-group">
          <h4><label>4. Style</label></h4>
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
          <h4><label htmlFor="iconTags">5. Tags</label></h4>
          <input type="text" name="iconTags" data-role="tagsinput" className="form-control" />
        </div>
        
        <div className="form-group">
          <h4><label htmlFor="iconDesc">6. Description</label></h4>
          <textarea id="iconDesc" name="iconDesc" placeholder="Lorem ipsum..." className="form-control" rows="3"></textarea>
        </div>
        
        <div className="form-group">
          <h4><label htmlFor="iconLib">7. Library</label></h4>
          <input type="text" id="iconLib" name="iconLib" className="form-control" defaultValue="The Icon Set" />
        </div>
        
        <div className="checkbox">
          <label>
            <input type="checkbox" name="iconPremium" value="isPremium" /> Premium?
          </label>
        </div>
        
        <button className="btn btn-primary">Upload</button>
      </form>
    </DefaultLayout>
  );
}

module.exports = Upload;
