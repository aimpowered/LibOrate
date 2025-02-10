import { Provider } from "./context";
import Content from "./content";

export default function (props) {
  return (
    <Provider {...props}>
      <Content />
    </Provider>
  );
}
