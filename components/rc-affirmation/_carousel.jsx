import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import RcHoverButton from "@/components/rc-hover-button";
import { useMyContext } from "./context";
import { PrevArrowSvg, NextArrowSvg, MoreSvg, PlusSvg } from "./assets";
import Modal from "@/components/rc-modal";
import AffirmationOpt from "./_carousel_opt";

const CarouselWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  padding: 0px 10px;
  border-radius: 10px;
  background: linear-gradient(#98b8cd, #cbb3e5);

  .slider-container {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const CarouselItem = styled.div`
  color: #ffffff;
  font-size: 32px;
  padding: 0 1.5rem;
  transform: scale(${(props) => props.scale || 1});
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ButtonItem = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const RoundButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 2px 1px white;
  background: transparent;
  color: black;
  border: 1px solid #ccc;
  width: 2rem;
  height: 2rem;
  border-radius: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #fff;
  }
`;

const NextArrow = styled(RoundButton)`
  right: 10px;
`;

const PrevArrow = styled(RoundButton)`
  left: 10px;
`;

export default () => {
  const {
    data,
    currentIndex,
    setCurrentIndex,
    addAffirmation,
    updateAffirmation,
    deleteAffirmation,
  } = useMyContext();
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef(null);
  const sliderRef = useRef(null);
  const originalWidth = useRef(0);
  const originalHeight = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      originalWidth.current = wrapper.offsetWidth;
      originalHeight.current = wrapper.offsetHeight;
    }

    const handleResize = (entries) => {
      for (let entry of entries) {
        if (entry.target === wrapper) {
          const newWidth = entry.contentRect.width;
          const newHeight = entry.contentRect.height;
          const widthRatio = newWidth / originalWidth.current;
          const heightRatio = newHeight / originalHeight.current;
          setScale(Math.min(widthRatio, heightRatio));
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (wrapper) {
      resizeObserver.observe(wrapper);
    }

    return () => {
      if (wrapper) {
        resizeObserver.unobserve(wrapper);
      }
    };
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: <></>,
    prevArrow: <></>,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentIndex(newIndex);
    },
  };

  return (
    <CarouselWrapper ref={wrapperRef}>
      <RcHoverButton
        place="bottom left"
        icon={<MoreSvg />}
        style={{ right: 30 }}
      >
        <ButtonItem onClick={() => AffirmationOpt.add(addAffirmation)}>
          New
        </ButtonItem>
        {currentIndex === data.length ? null : (
          <>
            <ButtonItem
              onClick={() =>
                AffirmationOpt.update(data[currentIndex], updateAffirmation)
              }
            >
              Editor
            </ButtonItem>
            <ButtonItem onClick={() => AffirmationOpt.dele(deleteAffirmation)}>
              Delete
            </ButtonItem>
          </>
        )}
      </RcHoverButton>
      <div className="slider-container">
        <Slider ref={sliderRef} {...settings}>
          {data?.map((item, index) => (
            <CarouselItem key={index} scale={scale}>
              <div className="center">{item}</div>
            </CarouselItem>
          ))}
          <CarouselItem key="add_affirmation" scale={scale}>
            <div
              className="center"
              onClick={() => AffirmationOpt.add(addAffirmation)}
            >
              <PlusSvg />
            </div>
          </CarouselItem>
        </Slider>
      </div>
      <NextArrow
        onClick={() => {
          sliderRef.current.slickNext();
          setCurrentIndex((prevIndex) => (prevIndex + 1) % (data.length + 1));
        }}
      >
        <NextArrowSvg />
      </NextArrow>
      <PrevArrow
        onClick={() => {
          sliderRef.current.slickPrev();
          setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? data.length : prevIndex - 1
          );
        }}
      >
        <PrevArrowSvg />
      </PrevArrow>
    </CarouselWrapper>
  );
};
