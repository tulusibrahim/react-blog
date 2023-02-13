import { useHistory } from "react-router";
import { supabase } from "../configs/configurations";

const Logout = async (props) => {
  await supabase.auth.signOut();
  useHistory().push("/");
  return <div>Redirecting...</div>;
};

export default Logout;
