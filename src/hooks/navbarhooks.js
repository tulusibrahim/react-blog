import { useColorMode } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { supabase } from "../configs/configurations";

const useNavbar = (second) => {
  const [session, setSession] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [nickName, setNickName] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  let localSession = localStorage.getItem("supabase.auth.token");

  const getProfilePic = async () => {
    let profilePic = await supabase.storage
      .from("blog")
      .download(`profilePic/${supabase.auth.user().id}`);
    if (profilePic.data) {
      let image = URL.createObjectURL(profilePic.data);
      setProfilePic(image);
    }
  };

  const getUsername = async () => {
    let result = await supabase
      .from("blog_users")
      .select("nickname")
      .eq("id", supabase.auth.session().user.id);
    setNickName(result.data[0].nickname);
  };

  const logOut = async () => {
    swal({
      title: "Sure want to log out?",
      // text: "Once deleted, you will not be able to see the post anymore!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (res) => {
      if (res) {
        await supabase.auth.signOut();
        document.location.reload();
      }
    });
  };

  // useEffect(() => {

  //     // setProfilePic('')
  //     if (localStorage.getItem('supabase.auth.token') !== null) {
  //         setSession(true)
  //         setNickName('')
  //         getUsername()
  //         getProfilePic()
  //     }
  //     else {
  //         setSession(false)
  //     }
  // }, [localStorage])

  useEffect(() => {
    if (localStorage.getItem("supabase.auth.token") !== null) {
      setSession(true);
      setNickName("");
      getUsername();
      getProfilePic();
    } else {
      setSession(false);
    }
  }, [localSession]);

  useEffect(() => {
    setSession(supabase.auth.session());
  }, []);

  return { session, profilePic, nickName, colorMode, logOut };
};
export default useNavbar;
