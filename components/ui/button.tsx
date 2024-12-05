import { Button as BaseButton } from "@mui/base/Button";
import { styled } from "@mui/system";

const orange = "#d68071";
const gray = "#f0f0f0";

const Button = styled(BaseButton)(
  ({ theme }) => `
  padding: 10px 20px;
  background-color: transparent;
  color: black;
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  margin: 5px;
  font-size: 20px;
  box-shadow: 0 2px 1px white;

  &:hover {
    background-color: ${gray};
  }

  &:selected {
    background-color: ${orange};
    color: white;
    font-weight: bold;
  }
  `,
);

export { Button };
