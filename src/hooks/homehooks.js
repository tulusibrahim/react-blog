import React, { useState, useEffect } from "react";
import { supabase } from "../configs/configurations";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import TextTruncate from "react-text-truncate";
import { useToast } from "@chakra-ui/toast";
import { Center, Box, Flex, Image, Text } from "@chakra-ui/react";

const useHome = (second) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  let toast = useToast();

  const getData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog")
      .select()
      .eq("isDraft", "false")
      .order("date", { ascending: false });
    setData(data);
    setLoading(false);
  };

  const getFollowers = async (id) => {
    let getId = await supabase
      .from("blog_users")
      .select()
      .match({ id: supabase.auth.user().id });
    if (getId.error) {
      toast({ description: "Failed fetch data" });
      return;
    } else {
      let check = await supabase
        .from("blog_followers")
        .select()
        .eq("follower_id", getId.data[0].id);
      // console.log(check)
      if (check.data) {
        check.data.map(async (res) => {
          let getfollower = await supabase
            .from("blog_users")
            .select()
            .eq("id", res.user_id);
          // console.log(getfollower)
          if (getfollower.error) {
            toast({ description: "Failed to get follower" });
          } else {
            followers
              ? setFollowers((old) => [...old, getfollower.data[0]])
              : setFollowers(getfollower.data[0]);
            // setFollowers(getfollower.data)
          }
        });
      }
    }
    // setFollowers()
  };

  const ArticleHome = () => {
    return (
      <Masonry
        className="cardcon"
        breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
      >
        {data.map((res, index) => (
          <div className="card" key={index}>
            <Link
              className="title"
              to={{ pathname: `/article/${res.title}`, query: { res } }}
            >
              <div>{res.title}</div>
            </Link>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="date">
                {res.email
                  .replace("@gmail.com", "")
                  .replace("@yahoo.com", "")
                  .replace("@hotmail.com", "")
                  .replace("@email.com", "")}
                , {res.date}
              </div>
            </div>
            <div className="body">
              <TextTruncate
                line={Math.floor(Math.random() * 5) + 1}
                element="span"
                truncateText="…"
                text={res.body.replace(/<[^>]*>/g, "")}
                textTruncateChild={
                  <Link
                    className="title"
                    style={{ fontSize: 16, fontWeight: "bold" }}
                    to={{ pathname: `/article/${res.title}`, query: { res } }}
                  >
                    read more
                  </Link>
                }
              />
            </div>
          </div>
        ))}
      </Masonry>
    );
  };

  const FollowedPeople = (second) => {
    return (
      <Center color="white" d="flex" flexDirection="column">
        <Box py="20px" w="100%" fontSize="24px" fontWeight="bold">
          People
        </Box>
        <Box w="100%">
          {supabase.auth.session() == null ? (
            <Center>Login to see followed people.</Center>
          ) : (
            <Flex w="100%" justify="center" direction="column">
              {followers == "" ? (
                <Center color="white" fontStyle="italic">
                  No people followed so far.
                </Center>
              ) : (
                followers.map((res, key) => (
                  <Link
                    to={{ pathname: `/${res.nickname}` }}
                    style={{ width: "95%" }}
                  >
                    <Flex
                      key={key}
                      p="10px"
                      borderRadius="5px"
                      bg="#152b43"
                      align="center"
                      my="5px"
                    >
                      <Image
                        src={`https://bbgnpwbarxehpmmnyfgq.supabase.in/storage/v1/object/public/blog/profilePic/${res.id}`}
                        boxSize="50px"
                        fallbackSrc={`https://ui-avatars.com/api/?name=${res.nickname}&length=1`}
                        borderRadius="50%"
                        mr="10px"
                      />
                      <Text>{res.nickname}</Text>
                    </Flex>
                  </Link>
                ))
              )}
            </Flex>
          )}
        </Box>
      </Center>
    );
  };

  useEffect(async () => {
    getData();
    setFollowers([]);
    if (supabase.auth.session()) {
      getFollowers();
    }
    // document.title = "Home"
    // if (localStorage.getItem('supabase.auth.token')) {
    //     let itemm = localStorage.getItem('supabase.auth.token')
    //     console.log(JSON.parse(itemm))
    //     // setNickName('')
    //     // getUsername()
    //     // getProfilePic()
    // }
  }, []);

  return { ArticleHome, FollowedPeople, loading };
};
export default useHome;
