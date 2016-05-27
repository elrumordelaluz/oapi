import React from 'react';

const Element = (props) => {
  const { obj } = props;
  let childnodes;

  if (obj.childs !== null) {
    childnodes = Array.isArray(obj.childs)
      ? obj.childs.map((node, index) => <Element obj={ node } key={ index } />)
      : obj.childs;
  }

  return (
    <obj.name {...obj.attrs}>
      { childnodes }
    </obj.name>
  );
};

export default Element;
