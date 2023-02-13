import { Link } from "react-router-dom";
import { supabase } from "../configs/configurations";
import {
  Box,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import {
  AiOutlineAlert,
  AiOutlineLogin,
  AiOutlineLogout,
} from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { BsPen } from "react-icons/bs";
import useNavbar from "../hooks/navbarhooks";

const Navbar = (props) => {
  let { session, profilePic, nickName, colorMode, logOut } = useNavbar();

  return (
    <div className="navbarcon" data-testid="navbar">
      <div className="navbar">
        <div className="title">
          <Link to="/" className="link">
            Write
          </Link>
        </div>
        <Box
          className="right"
          bg={colorMode}
          h="10vh"
          w={["60%", "40%", "30%", "20%"]}
          d="flex"
          alignItems="center"
          justifyContent={session ? "space-evenly" : "flex-end"}
        >
          {session && nickName && (
            <Box
              fontSize="12px"
              fontWeight="normal"
              bg="#399930"
              p="4px"
              borderRadius="4px"
            >
              <Link to={{ pathname: `/${nickName}` }}>
                {nickName
                  ? nickName
                  : supabase.auth
                      .user()
                      .email.replace("@gmail.com", "")
                      .replace("@yahoo.com", "")
                      .replace("@hotmail.com", "")}
              </Link>
            </Box>
          )}
          <Menu>
            <MenuButton>
              {session ? (
                <Image
                  src={
                    profilePic
                      ? profilePic
                      : `https://ui-avatars.com/api/?name=${
                          supabase.auth.user().email
                        }&length=1`
                  }
                  boxSize={["30px", "30px", "30px", "30px"]}
                  borderRadius="50%"
                ></Image>
              ) : (
                <BiUser size="25px" data-testid="profileimage" />
              )}
            </MenuButton>
            <MenuList bg="#0D1B2A" borderColor="GrayText">
              {session !== null ? (
                <>
                  <Link to="/profile">
                    <MenuItem
                      _focus={{ bg: "#1c3857" }}
                      style={{ fontWeight: "normal" }}
                    >
                      <BiUser style={{ marginRight: "10px" }} />
                      Profile
                    </MenuItem>
                  </Link>
                  <Link to="/new">
                    <MenuItem
                      _focus={{ bg: "#1c3857" }}
                      style={{ fontWeight: "normal" }}
                    >
                      <BsPen style={{ marginRight: "10px" }} /> Write new
                    </MenuItem>
                  </Link>
                  <MenuItem
                    _focus={{ bg: "#1c3857" }}
                    onClick={logOut}
                    style={{ fontWeight: "normal" }}
                  >
                    <AiOutlineLogout style={{ marginRight: "10px" }} /> Log out
                  </MenuItem>
                  <Link to="/about">
                    <MenuItem
                      _focus={{ bg: "#1c3857" }}
                      style={{ fontWeight: "normal" }}
                    >
                      <AiOutlineAlert style={{ marginRight: "10px" }} />
                      About us
                    </MenuItem>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <MenuItem
                      _focus={{ bg: "#1c3857" }}
                      style={{ fontWeight: "normal" }}
                    >
                      <AiOutlineLogin style={{ marginRight: "10px" }} /> Log in
                    </MenuItem>
                  </Link>
                  <Link to="/about">
                    <MenuItem
                      _focus={{ bg: "#1c3857" }}
                      style={{ fontWeight: "normal" }}
                    >
                      <AiOutlineAlert style={{ marginRight: "10px" }} />
                      About us
                    </MenuItem>
                  </Link>
                </>
              )}
            </MenuList>
          </Menu>
        </Box>
      </div>
    </div>
  );
};

export default Navbar;
