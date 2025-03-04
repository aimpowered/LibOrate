import { Provider } from "./context";
import Content from "./content";

const Affirmation = (props) => {
  return (
    <Provider {...props}>
      <Content />
    </Provider>
  );
};

Affirmation.displayName = "Affirmation";

export default Affirmation;
