import { Box, Flex } from "@chakra-ui/layout";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    document.title = "About Us";
  }, []);

  return (
    <Flex
      width="100%"
      height="90vh"
      textAlign="center"
      color="white"
      direction="column"
      justify="center"
      align="center"
    >
      <Box>About us,</Box>
      <Box>Made with passion, and ❤ since 21 Feb 2021.</Box>
    </Flex>
  );
};

export default About;
