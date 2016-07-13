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
      <form action="/upload" method="post" encType="multipart/form-data">        
        <div className="form-group">
          <label htmlFor="iconFile">Icon files</label>
          <input type="file" id="iconFile" name="iconFile" required multiple />
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
          <label htmlFor="iconLib">Library</label>
          <input type="text" id="iconLib" name="iconLib" className="form-control" defaultValue="The Icon Set" />
        </div>

        <button className="btn btn-primary">Upload</button>
      </form>
  );
}

module.exports = UploadMultiple;
