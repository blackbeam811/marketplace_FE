import { collectionSliderData } from "@/data/collectionSliderData";
import Image from "next/image";
import Carousel from "react-multi-carousel";

export default function CollectionSlider(props: { loadingState: boolean }) {
  return (
    <div
      className={`flex justify-center items-center my-10 w-full ${
        !props.loadingState && "hidden"
      }`}
    >
      <div className="w-full">
        <Carousel
          className="relative z-[1] bg-transparent"
          containerClass="container-with-dots"
          draggable
          autoPlay={false}
          focusOnSelect={false}
          infinite
          keyBoardControl
          minimumTouchDrag={80}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024,
              },
              items: 5,
              partialVisibilityGutter: 40,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },
              items: 2,
              partialVisibilityGutter: 30,
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 768,
              },
              items: 4,
              partialVisibilityGutter: 30,
            },
          }}
          shouldResetAutoplay
          showDots={false}
          arrows={true}
          slidesToSlide={1}
        >
          {[...Array(5)].map((_, index) => (
            <div className="relative px-2" key={index}>
              <div className="w-full aspect-square animate-pulse bg-green-900 rounded-md" />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
