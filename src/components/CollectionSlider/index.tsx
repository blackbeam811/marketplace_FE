import { collectionSliderData } from "@/data/collectionSliderData";
import Image from "next/image";
import Carousel from "react-multi-carousel";

export default function CollectionSlider() {
  return (
    <div className="flex justify-center items-center my-10 w-full">
      <div className="w-[350px] md:w-[700px] lg:w-[950px] 2xl:w-[1440px] xl:w-[1024px]">
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
              items: 4,
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
              items: 3,
              partialVisibilityGutter: 30,
            },
          }}
          shouldResetAutoplay
          showDots={true}
          sliderClass=""
          arrows={true}
          slidesToSlide={1}
        >
          {collectionSliderData.map((data, index) => (
            <div className="relative px-2" key={index}>
              <div className="relative border-gray-500 border-7 bg-white bg-opacity-10 backdrop-blur-md p-2 rounded-lg w-full cursor-pointer aspect-square border-[1px] overflow-hidden">
                <Image
                  src={data.imgUrl}
                  fill
                  className="rounded-lg w-[40px] hover:scale-105 duration-300"
                  alt=""
                />
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
