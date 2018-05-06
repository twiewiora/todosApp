import React from "react";
import ReactLoading from "react-loading";
import "./loaderStyles.css";
import styled from "tachyons-components";

export const Section = styled('div')`
flex flex-wrap content-center justify-center w-100 h-100 bg-transparent`

const Loader = () => (
    <Section>
        <ReactLoading type="spinningBubbles" color="#9999ff" />
    </Section>
);

export default Loader;
