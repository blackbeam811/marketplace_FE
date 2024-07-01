/* eslint-disable @next/next/no-img-element */

export const FoldingCubeSpinner = () => {
  return (
    <div className="sk-folding-cube">
      <div className="sk-cube1 sk-cube"></div>
      <div className="sk-cube2 sk-cube"></div>
      <div className="sk-cube4 sk-cube"></div>
      <div className="sk-cube3 sk-cube"></div>
    </div>
  );
};

export const DiscordSpinner = () => {
  return (
    <div className="spinner">
      <div className="cube1"></div>
      <div className="cube2"></div>
    </div>
  );
};

export const NormalSpinner = (props: { width: number; height: number }) => {
  return (
    <img
      alt="loading"
      src="/images/loadingImg.png"
      className="w-7 h-7 animate-spin"
    />
  );
};
