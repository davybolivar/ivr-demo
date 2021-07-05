import React from 'react';

const Sidebar = (props) => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-80 relative bg-white rounded-lg p-3 mr-3 flex flex-col">
            <h2>Draggable Nodes yo</h2>
            <div onDragStart={(event) => onDragStart(event, 'iconNode')} draggable>
                Custom Node
            </div>
            <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
            Default Node
            </div>
            <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
            Output Node
            </div>
            <div className="mt-auto">
                <span>Update workflow data</span>
                <textarea onChange={(e) => props.handleUpdateData(e.target.value)}
                    className="border w-full"
                    rows="10"
                />           
            </div>
        </aside>
      );
};

export default Sidebar;