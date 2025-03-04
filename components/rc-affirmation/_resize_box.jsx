import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useMyContext } from "./context";

const ResizeBoxWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
`;

const ResizeHandle = styled.div`
  position: absolute;
  background: transparent;
  z-index: 10;
`;

const ResizeHandleTop = styled(ResizeHandle)`
  top: 0;
  left: 5px;
  height: 5px;
  width: calc(100% - 10px);
  cursor: ns-resize;
`;

const ResizeHandleBottom = styled(ResizeHandle)`
  bottom: 0;
  left: 5px;
  height: 5px;
  width: calc(100% - 10px);
  cursor: ns-resize;
`;

const ResizeHandleLeft = styled(ResizeHandle)`
  top: 5px;
  left: 0;
  width: 5px;
  height: calc(100% - 10px);
  cursor: ew-resize;
`;

const ResizeHandleRight = styled(ResizeHandle)`
  top: 5px;
  right: 0;
  width: 5px;
  height: calc(100% - 10px);
  cursor: ew-resize;
`;

const ResizeHandleCorner = styled(ResizeHandle)`
  width: 5px;
  height: 5px;
`;

const ResizeHandleTopLeft = styled(ResizeHandleCorner)`
  top: 0;
  left: 0;
  cursor: nwse-resize;
`;

const ResizeHandleTopRight = styled(ResizeHandleCorner)`
  top: 0;
  right: 0;
  cursor: nesw-resize;
`;

const ResizeHandleBottomLeft = styled(ResizeHandleCorner)`
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
`;

const ResizeHandleBottomRight = styled(ResizeHandleCorner)`
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
`;

let orignWidth, orignHeight;

const ResizeBox = ({ children }) => {
  const { resize } = useMyContext();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(128);
  const boxRef = useRef(null);

  useEffect(() => {
    orignWidth = boxRef.current?.offsetWidth || 400;
    orignHeight = boxRef.current?.offsetHeight || 128;
  }, []);

  const handleMouseDown = (e, direction) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = boxRef.current?.offsetWidth || 400;
    const startHeight = boxRef.current?.offsetHeight || 128;

    const onMouseMove = (e) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes("right")) {
        newWidth = startWidth + (e.clientX - startX);
      }
      if (direction.includes("left")) {
        newWidth = startWidth - (e.clientX - startX);
      }
      if (direction.includes("bottom")) {
        newHeight = startHeight + (e.clientY - startY);
      }
      if (direction.includes("top")) {
        newHeight = startHeight - (e.clientY - startY);
      }
      
      if (direction.includes("top") || direction.includes("bottom")) {
        newHeight = Math.min(Math.max(newHeight, 60), orignHeight);
      }
      if (direction.includes("left") || direction.includes("right")) {
        newWidth = Math.min(Math.max(newWidth, 200), orignWidth);
      }
      
      setWidth(newWidth);
      setHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <ResizeBoxWrapper
      ref={boxRef}
      style={{ width: width ? width : "100%", height }}
    >
      {['top', 'vertical', 'all'].includes(resize)?<ResizeHandleTop onMouseDown={(e) => handleMouseDown(e, "top")} />:null}
      {['bottom', 'vertical', 'all'].includes(resize)?<ResizeHandleBottom onMouseDown={(e) => handleMouseDown(e, "bottom")} />:null}
      {['left', 'horizontal', 'all'].includes(resize)?<ResizeHandleLeft onMouseDown={(e) => handleMouseDown(e, "left")} />:null}
      {['right', 'horizontal', 'all'].includes(resize)?<ResizeHandleRight onMouseDown={(e) => handleMouseDown(e, "right")} />:null}
      {['top-left', 'all'].includes(resize)?<ResizeHandleTopLeft
        onMouseDown={(e) => handleMouseDown(e, "top-left")}
      />:null}
      {['top-right', 'all'].includes(resize)?<ResizeHandleTopRight
        onMouseDown={(e) => handleMouseDown(e, "top-right")}
      />:null}
      {['bottom-left', 'all'].includes(resize)?<ResizeHandleBottomLeft
        onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
      />:null}
      {['bottom-right', 'all'].includes(resize)?<ResizeHandleBottomRight
        onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
      />:null}
      {children}
    </ResizeBoxWrapper>
  );
};

export default ResizeBox;
