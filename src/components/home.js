import { useEffect, useState } from "react";
import { supabase } from "../configs/configurations";
import parse from "html-react-parser";
import Tags from "./taglist";
import { Box, Center, Flex } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import useHome from "../hooks/homehooks";

const Home = () => {
  let { ArticleHome, loading, FollowedPeople } = useHome();

  if (loading) {
    return (
      <Flex
        w={["100%", "100%", "75%", "80%"]}
        h="70vh"
        justify={"center"}
        align="center"
        fontSize={"32px"}
      >
        Loading
      </Flex>
    );
  }

  return (
    <Flex>
      <Box w={["100%", "100%", "75%", "80%"]}>
        <Tags />
        <ArticleHome />
      </Box>
      <Box
        w={["0%", "0%", "25%", "20%"]}
        display={["none", "none", "block", "block"]}
      >
        <FollowedPeople />
      </Box>
    </Flex>
  );
};

export default Home;
