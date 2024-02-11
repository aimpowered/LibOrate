"use client";
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
// import { useCustomState } from './state';


interface Button {
  id: number;
  text: string;
}

interface AffirmationProps {
  allAffirmations: Button[];
  setCurrentAffirmation: (buttons: string) => void;
  setAllAffirmations: (text: Button[]) => void;
}


function Affirmation({
  allAffirmations,
  setCurrentAffirmation,
  setAllAffirmations,
}: AffirmationProps) {

  // const { state, setCurrentAffirmation, setAllAffirmations  } = useCustomState();
  // console.log('current AllAffirmations', state.allAffirmations)

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const [buttons, setButtons] = useState(allAffirmations)

  // console.log('applyed', state.selectedAffirmation)

  useEffect(() => {
    setAllAffirmations(buttons);
  }, [buttons, setAllAffirmations]);

  const openModal = (button: Button) => {
    setModalIsOpen(true);
    setCurrentEditId(button.id);
    setEditText(button.text);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleEdit = () => {
    setButtons((prevButtons) =>
      prevButtons.map((button) => {
        // console.log('Original text:', button.text);

        if (button.id === currentEditId) {
          // console.log('Edited text:', editText);
          return { ...button, text: editText };
        } else {
          return button;
        }
      })
    );
    closeModal();
  };

  const deleteButton = (id: number) => {
    setButtons((prevButtons) => prevButtons.filter((button) => button.id !== id));
  };

  const addButton = () => {
    const newId = Math.max(0, ...buttons.map((b) => b.id)) + 1; // Create a new ID
    const newButton: Button = { id: newId, text: '' };
    setButtons((prevButtons) => [...prevButtons, newButton]);
    setModalIsOpen(true);
    setCurrentEditId(newId);
  };


  return (

    <div className="bg-white w-screen h-screen">

      <div style={{ marginLeft: '20px', marginRight: '20px', alignItems: 'center' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 'bold', display: 'inline-block', margin: '0' }}>Affirmation</h2>
        <button
          style={{
            border: 'none',
            display: 'inline-block',
            fontSize: '24px',
            padding: '10px',
            width: '50px', // Set a fixed width, adjust as needed
            height: '50px', // Set a fixed height, adjust as needed
            boxSizing: 'border-box', // Include padding in the total width
          }}
          onClick={addButton}
          aria-label="New Affirmation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="#f7f3f3" stroke="none" />
            <line x1="30" y1="50" x2="70" y2="50" stroke="#d68071" strokeWidth="8" />
            <line x1="50" y1="30" x2="50" y2="70" stroke="#d68071" strokeWidth="8" />
          </svg>
        </button>
      </div>

      {buttons.map((button) => (
        <div key={button.id} className="dropdown">
          <button className="dots-button"> {button.text}</button>
          <div className="dropdown-content">
            <button style={{ border: '0.5px solid black' }} onClick={() => setCurrentAffirmation(button.text)}>
              Apply
            </button>
            <button style={{ border: '0.5px solid black' }} onClick={() => openModal(button)}>
              Edit
            </button>
            <button style={{ border: '0.5px solid black' }} onClick={() => deleteButton(button.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Button Text"
        className="Modal"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        <div className="Modal-Body">
          <textarea
            placeholder="Edit text"
            className="large-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          ></textarea>
        </div>
        <button onClick={handleEdit}>Save</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
}

export default Affirmation;
