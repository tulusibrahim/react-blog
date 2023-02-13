import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../configs/configurations";

const useProfile = (second) => {
  let { user } = useParams();
  const [profile, setProfile] = useState([]);
  const [data, setData] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [savedId, setSavedId] = useState("");
  const [followState, setFollowState] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [showBtnFollow, setShowBtnFollow] = useState(true);
  let toast = useToast();

  const getProfile = async () => {
    let profile = await supabase
      .from("blog_users")
      .select("*,blog(*)")
      .match({ nickname: user });
    console.log(profile);
    setProfile(profile.data[0]);
    // setData(profile.data[0].blog)
    setSavedId(profile.data[0].id);
    getProfilePic(profile.data[0].id);
    getFollowers(profile.data[0].id);
    getFollowing(profile.data[0].id);

    let filteredArray = profile.data[0].blog.filter(
      (res) => res.isDraft !== "true"
    );
    console.log(filteredArray);
    setData(filteredArray);

    if (supabase.auth.session()) {
      isFollow(profile.data[0].id);
      if (supabase.auth.user().id == profile.data[0].id) {
        setShowBtnFollow(false);
      }
    } else {
      setShowBtnFollow(false);
    }
  };

  const getProfilePic = async (id) => {
    // console.log(id)
    let profilePic = await supabase.storage
      .from("blog")
      .download(`profilePic/${id}`);
    if (profilePic.data) {
      let image = URL.createObjectURL(profilePic.data);
      setProfilePic(image);
    }
  };

  const getFollowers = async (id) => {
    let check = await supabase
      .from("blog_followers")
      .select()
      .eq("user_id", id);
    console.log(check);
    if (check.data) {
      setFollowers(check.data.length);
    }
  };

  const getFollowing = async (id) => {
    let check = await supabase
      .from("blog_followers")
      .select()
      .eq("follower_id", id);
    console.log(check);
    if (check.data) {
      setFollowing(check.data.length);
    }
  };

  const isFollow = async (userId) => {
    const check = await supabase
      .from("blog_followers")
      .select()
      .match({ user_id: userId, follower_id: supabase.auth.user().id });
    console.log(check);
    if (check.data.length) {
      setFollowState("Followed");
    } else {
      setFollowState("Follow");
    }
  };

  const followUnfollowUser = async () => {
    if (!supabase.auth.session()) {
      toast({
        description: "Log in first to follow " + profile.nickname,
        status: "info",
      });
    } else {
      if (followState == "Followed") {
        let unfollow = await supabase
          .from("blog_followers")
          .delete()
          .match({ user_id: profile.id, follower_id: supabase.auth.user().id });

        if (unfollow.data.length) {
          setFollowState("Follow");
        } else if (unfollow.error) {
          toast({
            description: "Failed to unfollow, pleas try again",
            status: "warning",
          });
        }
        getFollowers(savedId);
      } else {
        let follow = await supabase
          .from("blog_followers")
          .insert({
            user_id: profile.id,
            follower_id: supabase.auth.user().id,
          });

        if (follow.data.length) {
          setFollowState("Followed");
        } else if (follow.error) {
          toast({
            description: "Failed to follow, pleas try again",
            status: "warning",
          });
        }
        getFollowers(savedId);
      }
    }
  };

  // useEffect(() => {
  //     document.title = user
  //     if (supabase.auth.session()) {
  //         // console.log(props)
  //         setSavedId('')
  //         setProfilePic('')
  //         getProfile()
  //         // getData()
  //     }
  // }, [])

  useEffect(async () => {
    document.title = user;
    // console.log(props)
    setSavedId("");
    setProfilePic("");
    setShowBtnFollow(true);
    getProfile();
    setFollowState("");
    // let result = await supabase.from('blog_followers').delete().match({ user_id: 'ba2475e1-f5e3-45e7-b330-c5feddef40c1', follower_id: 'ba2475e1-f5e3-45e7-b330-c5feddef40c1' })
    // getData()
  }, [user]);

  return {
    user,
    data,
    profilePic,
    followers,
    following,
    showBtnFollow,
    profile,
    followUnfollowUser,
    followState,
  };
};
export default useProfile;
