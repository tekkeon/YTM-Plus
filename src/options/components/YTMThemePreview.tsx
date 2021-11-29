import React from "react";
import styled from "styled-components";
import { YTMTheme } from "../../types";

interface YTMThemePreviewProps {
  ytmTheme: YTMTheme;
}

export default function YTMThemePreview({ ytmTheme }: YTMThemePreviewProps) {
  return (
    <Container
      width="650"
      height="370"
      viewBox="0 0 500 285"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="500" height="285" rx="12" fill="#595959" />

      {/* Main Section - Background */}
      <rect y="28" width="250" height="229" fill={ytmTheme.mainBackground} />

      <rect x="96" y="61" width="65" height="65" rx="5" fill="#C4C4C4" />
      <rect x="173" y="61" width="65" height="65" rx="5" fill="#C4C4C4" />
      <rect x="16" y="61" width="65" height="65" rx="5" fill="#C4C4C4" />
      <rect x="16" y="213" width="65" height="65" rx="5" fill="#C4C4C4" />
      <rect x="96" y="213" width="65" height="65" rx="5" fill="#C4C4C4" />
      <rect x="173" y="213" width="65" height="65" rx="5" fill="#C4C4C4" />

      {/* Main Section - Heading */}
      <rect
        x="16"
        y="42"
        width="100"
        height="9"
        rx="3"
        fill={ytmTheme.mainHeading}
      />
      <rect
        x="16"
        y="194"
        width="100"
        height="9"
        rx="3"
        fill={ytmTheme.mainHeading}
      />

      {/* Main Section - Primary Text */}
      <rect
        x="16"
        y="134"
        width="50"
        height="5"
        rx="2.5"
        fill={ytmTheme.mainPrimary}
      />
      <rect
        x="96"
        y="134"
        width="35"
        height="5"
        rx="2.5"
        fill={ytmTheme.mainPrimary}
      />
      <rect
        x="173"
        y="134"
        width="60"
        height="5"
        rx="2.5"
        fill={ytmTheme.mainPrimary}
      />

      {/* Main Section - Secondary Text */}
      <rect
        x="96"
        y="143"
        width="65"
        height="3"
        rx="1.5"
        fill={ytmTheme.mainSecondary}
      />
      <rect
        x="173"
        y="143"
        width="30"
        height="3"
        rx="1.5"
        fill={ytmTheme.mainSecondary}
      />
      <rect
        x="16"
        y="143"
        width="60"
        height="3"
        rx="1.5"
        fill={ytmTheme.mainSecondary}
      />

      {/* Line Separator */}
      <line x1="250.5" y1="28" x2="250.5" y2="257" stroke="#888888" />

      {/* Header/Footer - Background */}
      <path
        d="M0 12C0 5.37258 5.37258 0 12 0H488C494.627 0 500 5.37258 500 12V28H0V12Z"
        fill={ytmTheme.headerFooterBackground}
      />
      <path
        d="M0 257H500V273C500 279.627 494.627 285 488 285H12C5.37258 285 0 279.627 0 273V257Z"
        fill={ytmTheme.headerFooterBackground}
      />

      {/* Header/Footer - Secondary Text */}
      <rect
        x="193"
        y="271"
        width="69"
        height="3"
        rx="1.5"
        fill={ytmTheme.headerFooterSecondaryText}
      />

      {/* Header/Footer - Primary Text */}
      <rect
        x="230"
        y="12"
        width="41"
        height="5"
        rx="2.5"
        fill={ytmTheme.headerFooterPrimaryText}
      />
      <rect
        x="173"
        y="12"
        width="41"
        height="5"
        rx="2.5"
        fill={ytmTheme.headerFooterPrimaryText}
      />
      <rect
        x="287"
        y="12"
        width="41"
        height="5"
        rx="2.5"
        fill={ytmTheme.headerFooterPrimaryText}
      />
      <rect
        x="193"
        y="265"
        width="41"
        height="3"
        rx="1.5"
        fill={ytmTheme.headerFooterPrimaryText}
      />

      {/* Header/Footer - Album */}
      <rect x="173" y="264" width="14" height="14" rx="3" fill="#C4C4C4" />

      {/* Header/Footer - Logo Text */}
      <rect
        x="28"
        y="10"
        width="41"
        height="8"
        rx="3"
        fill={ytmTheme.logoText}
      />

      {/* Header/Footer - Logo */}
      <circle cx="16.5" cy="14.5" r="6.5" fill={ytmTheme.logo} />

      {/* Header/Footer - Buttons */}
      <path
        d="M37 270.5L28 276.129V264.871L37 270.5Z"
        fill={ytmTheme.headerFooterButtons}
      />

      {/* Queue - Background */}
      <rect
        x="251"
        y="28"
        width="249"
        height="229"
        fill={ytmTheme.queueBackground}
      />

      {/* Queue - Secondary Text */}
      <rect
        x="342"
        y="71"
        width="60"
        height="3"
        rx="1.5"
        fill={ytmTheme.queueSecondary}
      />
      <rect
        x="342"
        y="99"
        width="60"
        height="3"
        rx="1.5"
        fill={ytmTheme.queueSecondary}
      />
      <rect
        x="342"
        y="184"
        width="60"
        height="3"
        rx="1.5"
        fill={ytmTheme.queueSecondary}
      />
      <rect
        x="342"
        y="212"
        width="60"
        height="3"
        rx="1.5"
        fill={ytmTheme.queueSecondary}
      />
      <rect
        x="342"
        y="127"
        width="60"
        height="3"
        rx="1.5"
        fill={ytmTheme.queueSecondary}
      />
      <rect
        x="342"
        y="156"
        width="60"
        height="3"
        rx="1.5"
        fill={ytmTheme.queueSecondary}
      />

      {/* Queue - Primary Text */}
      <rect
        x="342"
        y="63"
        width="50"
        height="5"
        rx="2.5"
        fill={ytmTheme.queuePrimary}
      />
      <rect
        x="342"
        y="91"
        width="50"
        height="5"
        rx="2.5"
        fill={ytmTheme.queuePrimary}
      />
      <rect
        x="342"
        y="148"
        width="50"
        height="5"
        rx="2.5"
        fill={ytmTheme.queuePrimary}
      />
      <rect
        x="342"
        y="204"
        width="50"
        height="5"
        rx="2.5"
        fill={ytmTheme.queuePrimary}
      />
      <rect
        x="342"
        y="176"
        width="50"
        height="5"
        rx="2.5"
        fill={ytmTheme.queuePrimary}
      />
      <rect
        x="342"
        y="119"
        width="50"
        height="5"
        rx="2.5"
        fill={ytmTheme.queuePrimary}
      />

      {/* Queue - Heading */}
      <rect
        x="312"
        y="42"
        width="60"
        height="7"
        rx="3"
        fill={ytmTheme.queueHeading}
      />
      <rect
        x="380"
        y="42"
        width="60"
        height="7"
        rx="3"
        fill={ytmTheme.queueHeading}
      />

      {/* Queue - Albums */}
      <rect x="312" y="61" width="20" height="20" rx="4" fill="#C4C4C4" />
      <rect x="312" y="202" width="20" height="20" rx="4" fill="#C4C4C4" />
      <rect x="312" y="89" width="20" height="20" rx="4" fill="#C4C4C4" />
      <rect x="312" y="174" width="20" height="20" rx="4" fill="#C4C4C4" />
      <rect x="312" y="146" width="20" height="20" rx="4" fill="#C4C4C4" />
      <rect x="312" y="117" width="20" height="20" rx="4" fill="#C4C4C4" />
    </Container>
  );
}

const Container = styled.svg`
  margin: auto;
  display: block;
`;
