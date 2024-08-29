import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function Progressbar() {
  return (
    <div className="z-[99999]">
      <ProgressBar
        height="1px"
        color="#fffd00"
        options={{ showSpinner: true }}
        shallowRouting
      />
    </div>
  );
}
