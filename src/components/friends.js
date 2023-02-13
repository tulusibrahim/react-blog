import { Image } from "@chakra-ui/image";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { Link } from "react-router-dom";
import { supabase } from "../configs/configurations";
import useFriends from "../hooks/friendshooks";

const Friends = () => {
  let { followers, user, friends } = useFriends();

  return supabase.auth.session() == null ? (
    <Center w="100%" h="90vh" color="white">
      <Box>
        Login to see {user} {friends}.
      </Box>
    </Center>
  ) : (
    <Flex
      w="100%"
      h="90vh"
      color="white"
      direction="column"
      align="center"
      justify="flex-start"
    >
      <Flex w="80%" h="15vh" justify="flex-start" align="center">
        <Text fontSize="28px" fontWeight="bold">
          {user} {friends}
        </Text>
      </Flex>
      <Flex
        w="80%"
        h="fit-content"
        justify="center"
        align="flex-start"
        direction="column"
      >
        {followers == "" ? (
          <>
            {friends == "followers" ? (
              <Center color="white">Nobody follow {user}.</Center>
            ) : (
              <Center color="white">{user} didn't follow anyone.</Center>
            )}
          </>
        ) : (
          followers.map((res, key) => (
            <Box
              key={key}
              p="10px"
              my="10px"
              w="100%"
              className="card"
              borderRadius="5px"
              boxShadow="2px 2px 4px #060f18,-2px -2px 4px #152b43;"
            >
              <Link to={{ pathname: `/${res.nickname}` }}>
                <Flex align="center">
                  <Image
                    src={`https://bbgnpwbarxehpmmnyfgq.supabase.in/storage/v1/object/public/blog/profilePic/${res.id}`}
                    fallbackSrc={`https://ui-avatars.com/api/?name=${res.nickname}&length=1`}
                    borderRadius="50%"
                    mr="10px"
                    boxSize="50px"
                    FlexSize="30px"
                  />
                  <Box>
                    <Text fontSize="24px">{res.nickname}</Text>
                    <Text>{res.bio}</Text>
                  </Box>
                </Flex>
              </Link>
            </Box>
          ))
        )}
      </Flex>
    </Flex>
  );
};

export default Friends;
