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

const UploadMultiple = (props) => {
  return (
      <form action="/upload-multiple" id="upload-multiple"  method="post" encType="multipart/form-data">        
        <div className="form-group">
          <label htmlFor="multipleIconFiles">Icon files</label>
          <input type="file" id="multipleIconFiles" name="multipleIconFiles" required multiple />
          <p className="help-block">[ .svg ]</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="iconPack">Pack</label>
          <select 
            id="iconPack" 
            name="iconPack" 
            className="form-control" 
            defaultValue="def"
            required>
            <option disabled value="def">Select a pack...</option>
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
          <div className="radio">
            <label>
              <input type="radio" name="iconStyle" id="iconStyleColor" value="color" />
              Colored
            </label>
          </div>
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

module.exports = UploadMultiple;
