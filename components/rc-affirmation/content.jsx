import { ReactElement } from "react";
import ResizeBox from "./_resize_box";
import Carousel from "./_carousel";

const Content = () => {
  return (
    <ResizeBox>
      <Carousel />
    </ResizeBox>
  );
};

Content.displayName = "Content";

export default Content;
