import { Image } from "@chakra-ui/image";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useProfile from "../hooks/profilehooks";

const Profile = (props) => {
  let {
    user,
    data,
    profilePic,
    followers,
    following,
    showBtnFollow,
    profile,
    followState,
    followUnfollowUser,
  } = useProfile();

  return (
    <Flex w="100%" h="100%" mt="20px" justify="center" color="white">
      <Flex
        align="center"
        justify="space-evenly"
        w="70%"
        h="fit-content"
        mb="20px"
        direction="column"
      >
        <Flex
          align="center"
          w="100%"
          justify="space-evenly"
          direction={["row", "row", "column", "column"]}
          mb="20px"
        >
          <Image
            boxSize={["60px", "70px", "90px", "120px"]}
            borderRadius="50%"
            src={
              profilePic
                ? profilePic
                : `https://ui-avatars.com/api/?name=${profile.nickname}&length=1`
            }
          />
          <Flex
            align={["flex-start", "flex-start", "center", "center"]}
            direction="column"
          >
            <Text
              fontSize={["20px", "24px", "24px", "28px"]}
              ml="5px"
              wordBreak="break-all"
            >
              {profile.nickname}
            </Text>
            <Text
              fontStyle="italic"
              fontSize={["12px", "16px", "18px", "20px"]}
              ml="5px"
            >
              {profile.bio}
            </Text>
            <Flex>
              <Link to={{ pathname: `/${profile.nickname}/following` }}>
                <Text
                  ml="5px"
                  fontSize={["12px", "16px", "18px", "20px"]}
                  _hover={{ color: "gray.400" }}
                >
                  {following} Following •{" "}
                </Text>
              </Link>
              <Link to={{ pathname: `/${profile.nickname}/followers` }}>
                <Text
                  ml="5px"
                  fontSize={["12px", "16px", "18px", "20px"]}
                  _hover={{ color: "gray.400" }}
                >
                  {followers} Followers
                </Text>
              </Link>
            </Flex>
            {showBtnFollow && (
              <Button
                colorScheme="messenger"
                p={["10px", "12px", "14px", "16px"]}
                borderRadius="5px"
                ml="5px"
                mt="10px"
                onClick={followUnfollowUser}
              >
                {followState}
              </Button>
            )}
          </Flex>
        </Flex>
        <Flex direction="column" align="center" w="100%">
          {data == "" ? (
            <Center color="white" h="50px" w="100%">
              No post from {user}.
            </Center>
          ) : (
            data.map((res) => (
              // res.isDraft !== 'true' ?
              <Box
                w={["95%", "95%", "75%", "70%"]}
                p="10px"
                mt="5px"
                mb="5px"
                borderRadius=".5rem"
                border="1px #161f30 solid"
                _hover={{ boxShadow: "0px 0px 5px #305a88" }}
                boxShadow="2px 2px 4px #060f18, -2px -2px 4px #152b43"
              >
                <Link
                  to={{ pathname: `/article/${res.title}`, query: { res } }}
                >
                  <Text fontSize={["16px", "16px", "18px", "20px"]}>
                    {res.title}
                  </Text>
                </Link>
                <Text
                  fontSize={["10px", "10px", "12px", "12px"]}
                  color="#716F81"
                >
                  {res.date}
                </Text>
                <Text
                  noOfLines={3}
                  fontSize={["14px", "14px", "16px", "16px"]}
                  color="#C8C6C6"
                >
                  {res.body.replace(/<[^>]*>/g, "")}
                </Text>
                <Box>
                  <Text fontSize={["14px", "14px", "16px", "16px"]}>
                    ❤&nbsp; {res.likes ? res.likes : "0"}{" "}
                  </Text>
                </Box>
              </Box>
            ))
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Profile;
