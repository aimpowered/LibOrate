import styled from "styled-components";

interface ButtonProps {
  type?: "primary" | "danger";
  onClick?: () => void;
}

const Button = styled.button<ButtonProps>`
  height: 36px;
  line-height: 36px;
  border-radius: 6px;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  display: block;
  box-sizing: border-box;
  font-size: 14px;
  border: 1px solid rgb(217, 217, 217);
  padding: 0 1rem;
  ${(props) =>
    props.type === "primary" &&
    `
    border-color: rgb(22, 119, 255);
    color: rgb(22, 119, 255);
  `}

  ${(props) =>
    props.type === "danger" &&
    `
    border-color: rgb(255, 77, 79);
    color: rgb(255, 77, 79);
  `}
`;

export default Button;
