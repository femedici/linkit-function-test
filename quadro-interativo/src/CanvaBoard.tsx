import { Stage, Layer, Rect, Circle, Line, Text } from "react-konva";
import { useStore } from "./store";
import { useState } from "react";
import React from "react";

const CanvasBoard: React.FC = () => {
  const { shapes, addShape, removeShape, updateShape, connectShapes } = useStore();
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      addShape("rect", e.evt.layerX, e.evt.layerY);
    }
  };

  const handleRemoveShape = (id: string) => {
      removeShape(id);
  };

  const handleDragMove = (e: any, id: string) => {
    updateShape(id, { x: e.target.x(), y: e.target.y() });
  };

  const handleShapeClick = (id: string) => {
    if (connecting) {
      connectShapes(connecting, id);
      setConnecting(null);
    } else {
      setConnecting(id);
    }
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} onClick={handleStageClick}>
      <Layer>
        {shapes.map((shape) => (
          <React.Fragment key={shape.id}>
            <Rect
              x={shape.x}
              y={shape.y}
              width={shape.width!}
              height={shape.height!}
              cornerRadius={5} 
              fill="pink"
              draggable
              onDragMove={(e) => handleDragMove(e, shape.id)}
              onClick={() => handleShapeClick(shape.id)}
            />

            <Circle
              x={shape.x} // Posição ligeiramente fora do canto superior esquerdo
              y={shape.y}
              radius={10}
              fill="white"
              onClick={() => handleRemoveShape(shape.id)} // Chama a função de remoção
            />

            <Text
              x={shape.x - 5}
              y={shape.y - 5}
              text="X"
              fontSize={12}
              fontStyle="bold"
              fill="black"
              onClick={() => removeShape(shape.id)}
            />
          </React.Fragment>
        ))}


        {shapes.flatMap((shape) =>
          shape.connections.map((connId) => {
            const target = shapes.find((s) => s.id === connId);
            return (
              target && (
                <Line
                  key={`${shape.id}-${connId}`}
                  points={[shape.x + 50, shape.y + 25, target.x + 50, target.y + 25]}
                  stroke="white"
                  strokeWidth={3}
                />
              )
            );
          })
        )}
      </Layer>
    </Stage>
  );
};

export default CanvasBoard;
