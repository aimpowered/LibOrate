import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

interface HoverButtonProps {
  text?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  place: string;
  children: React.ReactNode;
}

const Button = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  position: absolute;
  right: 20px;
  top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const PopupPanel = styled.div`
  width: 88px;
  position: absolute;
  background-color: #fff;
  padding: 8px;
  border-radius: 4px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const HoverButton: React.FC<HoverButtonProps> = ({
  place,
  style,
  children,
  text,
  icon,
}) => {
  const [isPopuped, setIsPopup] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const offsetX = 15;
  const offsetY = -5;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isPopuped && buttonRef.current && popupRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popup = popupRef.current.getBoundingClientRect();

      let top = buttonRect.top;
      let left = buttonRect.left;

      if (place.includes("top")) {
        top -= popup.height - offsetY;
      } else if (place.includes("bottom")) {
        top += buttonRect.height + offsetY;
      }

      if (place.includes("left")) {
        left -= popup.width - offsetX;
      } else if (place.includes("right")) {
        left += buttonRect.width + offsetX;
      }

      popupRef.current.style.top = `${top}px`;
      popupRef.current.style.left = `${left}px`;
    }
  }, [isPopuped, place, offsetY]);

  const handleButtonClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsPopup(false);
  };

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setIsPopup(!isPopuped)}
        style={style}
      >
        {icon}
      </Button>
      {isPopuped &&
        ReactDOM.createPortal(
          <PopupPanel ref={popupRef} onClick={handleButtonClick}>
            {children}
          </PopupPanel>,
          document.body
        )}
    </>
  );
};

export default HoverButton;
