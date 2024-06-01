import { IconProps } from ".";

export function SolanaIcon({ className = "", fill = "black" }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M18.855 7.5192C18.7324 7.63196 18.5723 7.69535 18.4058 7.69717H2.63397C2.07423 7.69717 1.79149 7.05705 2.179 6.68245L4.7696 4.18515C4.89 4.06891 5.05005 4.00273 5.21739 4H21.0509C21.6164 4 21.8934 4.64586 21.5001 5.02189L18.855 7.5192Z"
        fill="url(#paint0_linear_169_9)"
      />
      <path
        d="M18.855 19.8276C18.7315 19.9382 18.5716 19.9995 18.4058 19.9998H2.63397C2.07423 19.9998 1.79149 19.3654 2.179 18.9908L4.7696 16.4863C4.89031 16.3715 5.05076 16.3077 5.21739 16.3084H21.0509C21.6164 16.3084 21.8934 16.9485 21.5001 17.3231L18.855 19.8276Z"
        fill="url(#paint1_linear_169_9)"
      />
      <path
        d="M18.855 10.3295C18.7315 10.2188 18.5716 10.1575 18.4058 10.1572H2.63397C2.07423 10.1572 1.79149 10.7916 2.179 11.1662L4.7696 13.6707C4.89186 13.7831 5.05131 13.8465 5.21739 13.8487H21.0509C21.6164 13.8487 21.8934 13.2085 21.5001 12.8339L18.855 10.3295Z"
        fill="url(#paint2_linear_169_9)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_169_9"
          x1="2.00103"
          y1="59.0685"
          x2="22.1862"
          y2="58.8834"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#599DB0" />
          <stop offset="1" stopColor="#47F8C3" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_169_9"
          x1="2.00103"
          y1="8.90254"
          x2="22.057"
          y2="8.74897"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C44FE2" />
          <stop offset="1" stopColor="#73B0D0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_169_9"
          x1="3.13343"
          y1="12.0029"
          x2="20.9217"
          y2="12.0029"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#778CBF" />
          <stop offset="1" stopColor="#5DCDC9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
