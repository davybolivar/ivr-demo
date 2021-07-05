import React, { memo } from 'react';
import FeatherIcon from 'feather-icons-react';

import nodeTypes from './nodeTypes.json';

import { Handle } from 'react-flow-renderer';

export default memo(({ data }) =>  {
    return (
        <>
            <Handle
                type="target"
                position="top"
                onConnect={(params) => console.log('Handle onConnect', params)}
            />
            <div className={`flex flex-col items-center p-5 ${nodeTypes[data.type]?.color}`}>
                { nodeTypes[data.type] &&
                    <FeatherIcon icon={nodeTypes[data.type]?.icon} size={25} className="stoke-current" />
                }
                                <h2 className="text-base text-gray-600 font-semibold">{ data.label }</h2>
                {data.subtitle && 
                    <code className="mt-2 text-xs text-gray-500 bg-white text-center rounded px-1 max-w-xs">
                        { data.subtitle }
                    </code>
                }
            </div>
            <Handle
                type="source"
                position="bottom"
                onConnect={(params) => console.log('Handle onConnect', params)}
            />
        </>
    );
});