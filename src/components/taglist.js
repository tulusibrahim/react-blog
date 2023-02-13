import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useTagList from "../hooks/taglisthooks";

const Tags = () => {
  let { session, dataTag } = useTagList();

  return (
    <Flex w="100%" h="20vh" justify="center">
      <Flex
        w={["95%", "95%", "95%", "95%"]}
        h="100%"
        color="white"
        justify="center"
        direction="column"
        align="flex-start"
      >
        <Text fontSize="32px" fontWeight="bold">
          Topics
        </Text>
        <Flex w="100%">
          <Flex overflow="auto" className="category">
            {dataTag.map((res, index) => (
              <Link to={{ pathname: `/topic/${res.name.replace("#", "")}` }}>
                <Box
                  _hover={{ bgColor: "green.700" }}
                  key={index}
                  m="5px"
                  bg="green.600"
                  p="8px"
                  borderRadius="50px"
                >
                  {res.name.replace("#", "")}
                </Box>
              </Link>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Tags;
