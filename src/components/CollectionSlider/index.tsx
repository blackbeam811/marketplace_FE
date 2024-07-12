import { collectionSliderData } from "@/data/collectionSliderData";
import Image from "next/image";
import Carousel from "react-multi-carousel";

export default function CollectionSlider(props: { loadingState: boolean }) {
  return (
    <div
      className={`flex justify-center items-center my-10 w-full ${
        props.loadingState && "hidden"
      }`}
    >
      <div className="w-full">
        <Carousel
          className="relative z-[1] bg-transparent"
          containerClass="container-with-dots"
          draggable
          autoPlay={true}
          autoPlaySpeed={2000}
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
          {collectionSliderData.map((data, index) => (
            <div className="relative px-2" key={index}>
              <div className="relative border-gray-500 border-7 bg-white bg-opacity-10 backdrop-blur-md p-2 rounded-lg w-full cursor-pointer aspect-square border overflow-hidden">
                <Image
                  src={data.imgUrl}
                  fill
                  className="rounded-lg w-[40px] hover:scale-105 duration-300"
                  alt=""
                  sizes=""
                />
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
