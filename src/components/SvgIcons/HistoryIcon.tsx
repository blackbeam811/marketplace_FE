import { IconProps } from ".";

export function HistoryIcon({ className = "", fill = "black" }: IconProps) {
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
        d="M12 8V12L14 14"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.0498 11.0001C3.2739 8.80013 4.30007 6.75968 5.93254 5.26803C7.56501 3.77639 9.6895 2.93795 11.9007 2.9127C14.1119 2.88744 16.255 3.67713 17.9211 5.1311C19.5872 6.58507 20.6597 8.60155 20.934 10.7958C21.2083 12.99 20.6651 15.2085 19.4082 17.0278C18.1512 18.8472 16.2684 20.1401 14.1191 20.6599C11.9697 21.1797 9.70421 20.89 7.7548 19.8461C5.80539 18.8022 4.30853 17.0772 3.5498 15.0001M3.0498 20.0001V15.0001H8.0498"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
