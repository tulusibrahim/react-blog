import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useToast } from "@chakra-ui/toast";
import { supabase } from "../configs/configurations";

const useFriends = (second) => {
  let { user, friends } = useParams();
  const [followers, setFollowers] = useState([]);
  let toast = useToast();

  const getFollowers = async (id) => {
    let getId = await supabase
      .from("blog_users")
      .select()
      .match({ nickname: user });
    console.log(getId);
    if (getId.error) {
      toast({ description: "Failed fetch data" });
    } else {
      let check = await supabase
        .from("blog_followers")
        .select()
        .eq("user_id", getId.data[0].id);
      console.log(check);
      if (check.data) {
        console.log(check.data);
        check.data.map(async (res) => {
          let getfollower = await supabase
            .from("blog_users")
            .select()
            .eq("id", res.follower_id);
          console.log(getfollower);
          if (getfollower.error) {
            toast({ description: "Failed to get follower" });
          } else {
            followers
              ? setFollowers((old) => [...old, getfollower.data[0]])
              : setFollowers(getfollower.data[0]);
          }
        });
      }
    }
  };

  const getFollowing = async (id) => {
    let getId = await supabase
      .from("blog_users")
      .select()
      .match({ nickname: user });
    console.log(getId);
    if (getId.error) {
      toast({ description: "Failed fetch data" });
    } else {
      let check = await supabase
        .from("blog_followers")
        .select()
        .eq("follower_id", getId.data[0].id);
      console.log(check);
      if (check.data) {
        console.log(check.data);
        check.data.map(async (res) => {
          let getfollower = await supabase
            .from("blog_users")
            .select()
            .eq("id", res.user_id);
          console.log(getfollower);
          if (getfollower.error) {
            toast({ description: "Failed to get follower" });
          } else {
            followers
              ? setFollowers((old) => [...old, getfollower.data[0]])
              : setFollowers(getfollower.data[0]);
          }
        });
      }
    }
  };

  useEffect(() => {
    setFollowers([]);
    if (friends == "followers") {
      // setFollowers([])
      document.title = `${user} ${friends}`;
      getFollowers();
    } else {
      document.title = `${user} ${friends}`;
      getFollowing();
    }
  }, []);

  return { followers, user, friends };
};
export default useFriends;
