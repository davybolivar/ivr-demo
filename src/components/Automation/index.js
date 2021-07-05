import React, { useState, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  addEdge,
  removeElements,
  updateEdge,
} from 'react-flow-renderer';

import IconNode from './IconNode'; 
import sampleData from './sampleData'; 

import {
  ApiToMapData as apiToMapData,
  MapToFlowData as mapToFlowData,
  GetLayoutedElements as getLayoutedElements,
} from '@/utils/FlowUtils';

import Sidebar from '@/components/Sidebar';

const nodeTypes = {
  iconNode: IconNode,
};

let id = 0;
const getId = () => `node_${id++}`;

const Automation = () => {
  const [dataValue, setDataValue] = useState(sampleData);
  const mapData = apiToMapData(dataValue);
  const initialElements = mapToFlowData(mapData);

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState(getLayoutedElements(initialElements));
  const onConnect = (params) => setElements((els) => addEdge({ ...params, type: 'smoothstep' }, els));
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
    const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);

  const onUpdateData = async (value) => {
    try {
      const json = await JSON.parse(value);
      const mapData = apiToMapData(json);
      const initialElements = getLayoutedElements(mapToFlowData(mapData));
      setElements(initialElements);
      setDataValue(value);
    } catch(err) {
      console.log('JSON IS INVALID');
    }
  };


  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: `${type} node` },
    };

    setElements((es) => es.concat(newNode));
  };
  const onEdgeUpdate = (oldEdge, newConnection) => setElements((els) => updateEdge(oldEdge, newConnection, els));

  return (
    <ReactFlowProvider>
      <section
        className="flex p-3 h-full w-full bg-indigo-50"
        ref={reactFlowWrapper}
      >
        <Sidebar handleUpdateData={onUpdateData}/>
        <ReactFlow
          elements={elements}
          snapToGrid={true}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onElementsRemove={onElementsRemove}
          onLoad={onLoad}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgeUpdate={onEdgeUpdate}
        >
          <Background
              variant="dots"
              gap={15}
              size={1}
              color={'#C7D2FE'}
          />
        </ReactFlow>
      </section>
    </ReactFlowProvider>
  );
};

export default Automation;