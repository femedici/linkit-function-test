import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import { useStore } from "./store";
import { useState } from "react";

const CanvasBoard: React.FC = () => {
  const { shapes, addShape, updateShape, connectShapes } = useStore();
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      addShape("rect", e.evt.layerX, e.evt.layerY);
    }
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
        {shapes.map((shape) =>
          shape.type === "rect" ? (
            <Rect
              key={shape.id}
              x={shape.x}
              y={shape.y}
              width={shape.width!}
              height={shape.height!}
              fill="blue"
              draggable
              onDragMove={(e) => handleDragMove(e, shape.id)}
              onClick={() => handleShapeClick(shape.id)}
            />
          ) : (
            <Circle
              key={shape.id}
              x={shape.x}
              y={shape.y}
              radius={shape.radius!}
              fill="red"
              draggable
              onDragMove={(e) => handleDragMove(e, shape.id)}
              onClick={() => handleShapeClick(shape.id)}
            />
          )
        )}

        {shapes.flatMap((shape) =>
          shape.connections.map((connId) => {
            const target = shapes.find((s) => s.id === connId);
            return (
              target && (
                <Line
                  key={`${shape.id}-${connId}`}
                  points={[shape.x + 50, shape.y + 50, target.x + 50, target.y + 50]}
                  stroke="black"
                  strokeWidth={2}
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
