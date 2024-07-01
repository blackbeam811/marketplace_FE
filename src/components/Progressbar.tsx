import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function Progressbar() {
  return (
    <div className="z-[9999]">
      <ProgressBar
        height="1px"
        color="#fffd00"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </div>
  );
}
