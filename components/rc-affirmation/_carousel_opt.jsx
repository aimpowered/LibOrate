import React, { useState } from "react";
import styled from "styled-components";
import Modal from "@/components/rc-modal";
import RcButton from "@/components/rc-button";

const Form = styled.div`
  .btn-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .affirmation-text {
    width: 100%;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
    resize: none;
    outline: none;
  }
`;

const AffirmationForm = ({ onOk, onClose, defaultValue }) => {
  const [text, setText] = useState(defaultValue || "");

  return (
    <Form>
      <textarea
        className="affirmation-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="btn-group">
        <RcButton type="primary" onClick={() => onOk && onOk(text)}>
          OK
        </RcButton>
        <RcButton onClick={onClose}>Cancel</RcButton>
      </div>
    </Form>
  );
};

const add = (handle) => {
  const handleAdd = (text) => {
    if (text) {
      handle(text);
    }
    Modal.close();
  };

  Modal.open(<AffirmationForm onOk={handleAdd} onClose={Modal.close} />, {
    width: 400,
  });
};

const update = (text, handle) => {
  const handleAdd = (text) => {
    if (text) {
      handle(text);
    }
    Modal.close();
  };

  Modal.open(
    <AffirmationForm
      defaultValue={text}
      onOk={handleAdd}
      onClose={Modal.close}
    />,
    {
      width: 400,
    }
  );
};

const dele = (handle) => {
  Modal.confirm("Ready to delete the message?", {
    width: 360,
    onOk: () => {
      handle();
    },
  });
};

const carouselOpt = { add, dele, update };

export default carouselOpt;
