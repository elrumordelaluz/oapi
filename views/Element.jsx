import React from 'react';

const TypeElem = (props) => {
  return props.hasOwnProperty('text') 
    ? <span>{ props.children }</span>
    : <props.name {...props.attrs}>{ props.children }</props.name>
}

const Element = (props) => {
  const { obj } = props;
  let childnodes;

  if (obj.childs !== null) {
    childnodes = Array.isArray(obj.childs)
      ? obj.childs.map((node, index) => <Element obj={ node } key={ index } />)
      : obj.childs;
  }
  
  return (
    <TypeElem {...obj}>
      { childnodes }
    </TypeElem>
  );
};

export default Element;
