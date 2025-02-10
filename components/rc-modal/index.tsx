import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import RcButton from "@/components/rc-button";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div<{ width?: number }>`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: ${(props) => (props.width ? `${props.width}px` : "500px")};
  width: 100%;

  .button-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .confirm-tip {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 500;
  }
`;

interface ModalProps {
  width?: number;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, width }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent width={width} onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

let modalContainer: HTMLDivElement | null = null;
let root: any | null = null;

interface OpenProps {
  width?: number;
}

const open = (content: React.ReactNode, options: OpenProps = {}) => {
  const { width } = options;

  if (!modalContainer) {
    modalContainer = document.createElement("div");
    document.body.appendChild(modalContainer);
    root = createRoot(modalContainer);
  }

  const handleClose = () => {
    if (modalContainer && root) {
      root.unmount();
      document.body.removeChild(modalContainer);
      modalContainer = null;
      root = null;
    }
  };

  root.render(
    <Modal onClose={handleClose} width={width}>
      {content}
    </Modal>
  );
};

const close = () => {
  if (modalContainer && root) {
    root.unmount();
    document.body.removeChild(modalContainer);
    modalContainer = null;
    root = null;
  }
};

interface ConfirmProps {
  width?: number;
  content: string;
  onClose: () => void;
  onOk: () => void;
}

const Confirm: React.FC<ConfirmProps> = ({ content, onClose, onOk }) => {
  return (
    <div>
      <p className="confirm-tip">{content}</p>
      <div className="button-group">
        <RcButton
          type="danger"
          onClick={() => {
            onOk();
            onClose && onClose();
          }}
        >
          Confirm
        </RcButton>
        <RcButton onClick={onClose}>Cancel</RcButton>
      </div>
    </div>
  );
};

const confirm = (content: string, { width, onClose, onOk }: ConfirmProps) => {
  const handleClose = () => {
    close();
    onClose && onClose();
  };

  const handleOk = () => {
    onOk();
    close();
  };

  open(<Confirm content={content} onClose={handleClose} onOk={handleOk} />, {
    width,
  });
};

interface AlertProps {
  width?: number;
  content: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ content, onClose }) => {
  return (
    <Modal onClose={onClose}>
      <p>{content}</p>
      <div>
        <button onClick={onClose}>Sure</button>
      </div>
    </Modal>
  );
};

const alert = (content: string, { width }: AlertProps) => {
  const handleClose = () => {
    close();
  };

  open(<Alert content={content} onClose={handleClose} />, { width });
};

export default { open, close, confirm, alert };
