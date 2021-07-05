import { isNode } from 'react-flow-renderer';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const EDGE_TYPE = 'smoothstep';
const NODE_POSITION = { x: 0, y: 0 };
const NODE_HEIGHT = 150;
const NODE_WIDTH = 350;

export const ApiToMapData = (data) => {
    try {
        // Return nothing if data doesn't contain 'definition' 
        if (!(data || {}).hasOwnProperty('definition')) {
            return
        }

        const { steps } = data.definition;
        let nodeMap = {
            root: {
                input: null,
                output: null,
                source: '',
                target: [],
                type: 'Root',
                data, // Add data only to root to get details of workflow
            }
        };

        for(let i = 0; i < steps.length; i++) {
            const {
                id: stepId,
                stepType: type,
                selectNextStep,
                nextStepId,
                inputs = null,
                outputs = null,
            } = steps[i];

            nodeMap[stepId] = {
                ...nodeMap[stepId],
                target: [],
                type,
                inputs,
                outputs,
            }

            // Inialize 'source' value
            if (!nodeMap.hasOwnProperty(stepId)) {
                nodeMap[stepId].source = '';
            } else if (!nodeMap[stepId].hasOwnProperty('source')) {
                nodeMap[stepId].source = 'root';
            }

            // Get children value from either 'nextStepId' or 'selectNextStep'
            const children = nextStepId ? [ nextStepId ] : Object.keys(selectNextStep || {});

            // Set the children of current node
            nodeMap[stepId].target = children;

            // If node has children then create new keys for it
            for(let ci = 0; ci < children.length; ci++) {
                const child = children[ci];
                if (!nodeMap.hasOwnProperty(child)) {
                    nodeMap[child] = {
                        ...nodeMap[child],
                        source: stepId,
                    }
                }
            }
        }

        return nodeMap;
    } catch(err) {
        console.error(err);
    }
};

export const MapToFlowData = (data) => {
    if (!Object.keys(data || {}).length) {
        return [] 
    }

    const flowData = Object.keys(data).reduce((acc, curr) => {
        const nodeData = data[curr];

        let nodeConfig = {};

        switch(nodeData.type) {
            case 'Root':
                nodeConfig = {
                    type: 'iconNode',
                    data: {
                        type: nodeData.type,
                        label: `${nodeData?.data?.trigger} trigger`,
                        subtitle: nodeData?.data?.definition?.name,
                    }
                }
                break;
            case 'SMS':
                nodeConfig = {
                    type: 'iconNode',
                    data: {
                        type: nodeData.type,
                        label: 'Send SMS reply',
                        subtitle: nodeData.inputs.text,
                    }
                }
                break;
            case 'ChatAppsMessage':
                nodeConfig = {
                    type: 'iconNode',
                    data: {
                        type: nodeData.type,
                        label: 'Send Chat reply',
                        subtitle: nodeData?.inputs?.content?.text,
                    }
                }
                break;
            case 'HttpRequest':
                nodeConfig = {
                    type: 'iconNode',
                    data: {
                        type: nodeData.type,
                        label: 'Make HTTP request',
                        subtitle: `${nodeData.inputs.method} ${nodeData.inputs.url}`,
                    }
                }
                break;
            case 'Wait':
                nodeConfig = {
                    type: 'iconNode',
                    data: {
                        type: nodeData.type,
                        label: nodeData.type,
                        subtitle: `${nodeData.inputs.minutes} minutes`,
                    }
                }
                break;
            default: 
                nodeConfig = {
                    type: 'iconNode',
                    data: {
                        type: nodeData.type,
                        label: nodeData.type,
                    }
                }
                break;
        }

        const node = {
            id: curr,
            position: NODE_POSITION,
            ...nodeConfig,
        };

        // Only create an adge if node has both source and target
        let edge = {};
        if (nodeData.source && curr) {
            edge = {
                id: `edge_${nodeData.source}_to_${curr}`,
                type: EDGE_TYPE,
                source: nodeData.source,
                target: curr,
            }
        }
        acc.push(node, edge);
        return acc;
    }, [])

    return flowData;
};

export const GetLayoutedElements = (elements, direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });
  
    elements.forEach((el) => {
      if (isNode(el)) {
        dagreGraph.setNode(el.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
      } else {
        dagreGraph.setEdge(el.source, el.target);
      }
    });
  
    dagre.layout(dagreGraph);
  
    return elements.map((el) => {
      if (isNode(el)) {
        const nodeWithPosition = dagreGraph.node(el.id);
        el.targetPosition = isHorizontal ? 'left' : 'top';
        el.sourcePosition = isHorizontal ? 'right' : 'bottom';
  
        el.position = {
          x: nodeWithPosition.x - NODE_WIDTH / 2 + Math.random() / 1000,
          y: nodeWithPosition.y - NODE_HEIGHT / 2,
        };
      }
  
      return el;
    });
  };