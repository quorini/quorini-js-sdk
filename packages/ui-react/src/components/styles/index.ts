import styled, { css } from "styled-components"

const Colors = {
    // Main background color – Slightly blueish-greenish almost white color | Cold white very very light gray
    background: "#eef2f6",
    transparentBackground: "rgba(238, 242, 246, 0.7)",
    transparentWhiteBackground: "rgba(255, 255, 255, 0.9)",
    transparentDarkFrostyBackground: "rgba(0, 0, 0, 0.25)",
    // Primary color – Dark gray almosst black
    primary: "#2c2c2c",
    primaryRed: "#d20101",
    // Even darker on hover
    primaryHover: "#1c1c1c",
    //
    grayDark: "#494b4d",
    grayNormal: "rgba(0, 10, 20, 0.35)",
    grayLight: "rgba(0, 5, 10, 0.06)",
}

const StyleHelpers = {
    boldBoxShadow: `0px 0px 15px 0px ${Colors.transparentDarkFrostyBackground}`,
    lightBoxShadow: `0px 0px 5px 0px ${Colors.transparentDarkFrostyBackground}`,
    staticBoxShadow: `0px 0px 2px 0px ${Colors.transparentDarkFrostyBackground}`,
    whiteGlowBoxShadow: `0 0 10px 3px ${Colors.transparentWhiteBackground}`,
    accentGlowShadow: `0 0 18px -8px ${Colors.primaryHover}`,
    blur: "blur(2px)",
    //
    radiusSmall: "10px",
    radiusMedium: "20px",
    //
    iconSize: "15px",
    largeIconSize: "25px",
}

const Spaces = {
    small: "5px",
    normal: "10px",
    medium: "15px",
    large: "20px",
    xLarge: "25px",
}

const Centered = styled.div<{ vertical?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-direction: ${(props) => (props.vertical ? "column" : "unset")};
    gap: ${Spaces.large};
`

const PageWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    background-color: ${Colors.background};
    /* padding: 10px 5px; */
`

const HalfContainer = styled.div<{ fullHeight?: boolean }>`
    flex: none;
    width: 50%;
    height: ${(props) => (props.fullHeight ? "100vh" : "unset")};
    overflow-y: scroll;

    box-shadow: ${StyleHelpers.boldBoxShadow};

    &:last-child {
        box-shadow: unset;
        padding: 0 0 0 ${Spaces.large};
    }

    &:last-child:first-child {
        width: 100vw;
        padding: 0;
    }

    .ant-tabs-nav {
        background-color: white;
        box-shadow: ${StyleHelpers.lightBoxShadow};
        z-index: 2;
    }
`

const OneThirdContainer = styled(HalfContainer)`
    width: 30%;
    // min-width: 420px;
`

const TwoThirdContainer = styled(HalfContainer)`
    width: 70%;
    // min-width: 980px;
`

const ItemWithFadeInAnimation = styled.div<{ reversed?: boolean }>`
    opacity: 0; /* start with opacity set to 0 */
    animation-name: fade-in; /* specify the animation */
    animation-duration: 1s; /* specify the duration */
    animation-fill-mode: forwards; /* keep the last frame of the animation */
    @keyframes fade-in {
        from {
            opacity: 0;
            position: relative;
            // 40px is general for any list items
            // -20px is unique for NewAuthType component
            left: ${(props) => (props.reversed ? "-20px" : "40px")};
        }
        to {
            opacity: 1;
            position: relative;
            left: 0px;
        }
    }
`

// Define mixins
const ScrollableBlock = css`
    overflow-y: scroll;
    overscroll-behavior: contain;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 30px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    }

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 30px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    }
`

export {
    Colors,
    Centered,
    PageWrapper,
    HalfContainer,
    OneThirdContainer,
    TwoThirdContainer,
    ItemWithFadeInAnimation,
    StyleHelpers,
    Spaces,
    ScrollableBlock,
}
