import React from 'react';
import DefaultLayout from './layouts/DefaultLayout';
import Element from './Element';
import UploadSingle from './UploadSingle';
import UploadMultiple from './UploadMultiple';

const Admin = (props) => {
  const packsKeys = Object.keys(props.packs);
  const countTotalIcons = (obj) => Object.keys(obj).reduce((prev, next) => {
    return prev + obj[next].icons;
  }, 0);
  
  const countTotalPremium = (obj) => Object.keys(obj).reduce((prev, next) => {
    return prev + obj[next].premium;
  }, 0);
  
  const totalIcons = countTotalIcons(props.packs);
  const totalPremium = countTotalPremium(props.packs);
  
  const getPercentage = (base, num) => {
    return (num * 100 / base).toFixed(1)
  }
  
  const renderPacks = () => packsKeys.map(pack => (
    <a className="list-group-item" key={pack} href={'/pack/' + pack}>{pack}{' '}
      <span className="label label-warning badge-premium pull-right"><b>{props.packs[pack].premium}</b> <small>/ {
          getPercentage(props.packs[pack].icons, props.packs[pack].premium)
        }%</small></span>
      <span className="badge">
        {props.packs[pack].icons}
      </span>
    </a>
  ));
  
  return (
    <DefaultLayout {...props}>
      <div className="jumbotron">
        <p>Orion Library Admin</p>
        
        <hr/>
        
        
        
        <div className="row">
          <div className="col-md-6">
            <p>Packs <span className="badge">{packsKeys.length}</span></p>
            <ul className="list-group">
              { renderPacks() }
            </ul>
            
            <p>Total Icons: <b>{ totalIcons }</b> <span className="label label-warning badge-premium">
              <b>{ totalPremium }</b> <small>/ {
                getPercentage(totalIcons, totalPremium)
              }%</small></span>
            </p>
          </div>
          
          <div className="col-md-6">
            <p>Meta</p>
            <form action="/update-suffix" id="update-suffix" className="form-inline" method="post">
              <div className="form-group">
                <label htmlFor="suffixNumber">Suffix</label> {' '}
                <input 
                  type="number" 
                  className="form-control" 
                  id="suffixNumber" 
                  name="suffixNumber" 
                  min="0"
                  placeholder={props.suffix} 
                  defaultValue={props.suffix}
                  required />
              </div>{' '}
              <button 
                className="btn btn-primary" 
                id="suffixUpdateButton"
                disabled>Update</button>
            </form>
          </div>
        </div>
          
        
      </div>
      
      <hr/>
      
      <div className="row">
        <div className="col-md-6">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3 className="panel-title">Upload Single Icon</h3>
            </div>
            <div className="panel-body">
              <UploadSingle />        
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="panel panel-info">
            <div className="panel-heading">
              <h3 className="panel-title">Upload Multiple Icons</h3>
            </div>
            <div className="panel-body">
              <UploadMultiple />
            </div>
          </div>
        </div>
      </div>
      
    </DefaultLayout>
  );
}

module.exports = Admin;
