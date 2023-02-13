import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { supabase } from "../configs/configurations";
import swal from "sweetalert";

const useLogin = (second) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setlogin] = useState("");
  const [show, setShow] = useState(false);
  let history = useHistory();

  const signUp = async (e) => {
    e.preventDefault();

    const { user, session, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    console.log(error);

    if (error) {
      swal("Failed to sign up, please try again", {
        icon: "warning",
      });
    } else {
      history.push("/");
      // document.location.reload()
    }
  };

  const logIn = async (e) => {
    e.preventDefault();
    e.target.reset();

    const { user, session, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });
    if (error) {
      // alert("Failed to sign in")
      swal("Failed to sign in. Please try again", {
        icon: "error",
      });
    } else {
      history.push("/");
      // document.location.reload()
    }
  };

  const loginWithGithub = async () => {
    const { user, session, error } = await supabase.auth.signIn({
      // provider can be 'github', 'google', 'gitlab', or 'bitbucket'
      provider: "github",
    });
  };

  useEffect(async () => {
    let isLogin = await supabase.auth.session();
    if (isLogin !== null) {
      history.push("/");
    }
  }, []);

  return {
    login,
    show,
    history,
    signUp,
    logIn,
    loginWithGithub,
    setEmail,
    setPassword,
    setlogin,
    setShow,
  };
};
export default useLogin;
