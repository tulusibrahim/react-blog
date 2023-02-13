import {
  Input,
  Text,
  InputGroup,
  Button,
  InputRightElement,
  Box,
  Flex,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import useLogin from "../hooks/loginhooks";

const Login = (props) => {
  let {
    login,
    show,
    signUp,
    logIn,
    loginWithGithub,
    setEmail,
    setPassword,
    setlogin,
    setShow,
  } = useLogin();

  return (
    <Flex
      direction="column"
      alignItems="center"
      justify="space-evenly"
      w="100%"
      h="90vh"
    >
      {login == "false" ? (
        <form onSubmit={signUp} style={{ height: "80%", width: "100%" }}>
          <Flex h="100%" direction="column">
            <Flex
              height="80%"
              justifyContent="space-evenly"
              alignItems="center"
              direction="column"
            >
              <Input
                variant="flushed"
                placeholder="Email"
                width={["93%", "70%", "50%", "30%"]}
                color="white"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputGroup width={["93%", "70%", "50%", "30%"]}>
                <Input
                  variant="flushed"
                  placeholder="Password"
                  type={show ? "text" : "password"}
                  color="white"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputRightElement>
                  <Button
                    h="1.75rem"
                    variant="outline"
                    size="sm"
                    colorScheme="whiteAlpha"
                    onClick={() => setShow(!show)}
                  >
                    {show ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Box textAlign="center" width={["93%", "70%", "50%", "30%"]}>
                <Text color="white">
                  Have an account? Login
                  <a
                    style={{ cursor: "pointer", color: "#536f8d" }}
                    onClick={() => setlogin("true")}
                  >
                    {" "}
                    here!
                  </a>
                </Text>
                <Button
                  variant="outline"
                  marginTop="10px"
                  colorScheme="whiteAlpha"
                  _hover={{ backgroundColor: "black", color: "white" }}
                  type="submit"
                  fontWeight="normal"
                >
                  Sign Up
                </Button>
              </Box>
            </Flex>
            <Flex
              height="20%"
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Text color="white" mb="10px">
                or login with
              </Text>
              <Box>
                <Button
                  variant="outline"
                  fontWeight="normal"
                  colorScheme="whiteAlpha"
                  _hover={{ backgroundColor: "black", color: "white" }}
                  onClick={() => loginWithGithub()}
                >
                  <i className="fab fa-github"></i>&nbsp;Github
                </Button>
              </Box>
            </Flex>
          </Flex>
        </form>
      ) : (
        <form onSubmit={logIn} style={{ height: "80%", width: "100%" }}>
          <Flex h="100%" direction="column">
            <Flex
              height="80%"
              justifyContent="space-evenly"
              alignItems="center"
              direction="column"
            >
              <Input
                variant="flushed"
                placeholder="Email"
                width={["93%", "70%", "50%", "30%"]}
                color="white"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputGroup width={["93%", "70%", "50%", "30%"]}>
                <Input
                  variant="flushed"
                  placeholder="Password"
                  type={show ? "text" : "password"}
                  color="white"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputRightElement>
                  <Button
                    h="1.75rem"
                    variant="outline"
                    size="sm"
                    colorScheme="whiteAlpha"
                    onClick={() => setShow(!show)}
                  >
                    {show ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Box textAlign="center" width={["93%", "70%", "50%", "30%"]}>
                <Text color="white">
                  Don't have an account? Create one
                  <a
                    style={{ cursor: "pointer", color: "#536f8d" }}
                    onClick={() => setlogin("false")}
                  >
                    {" "}
                    here!
                  </a>
                </Text>
                <Button
                  variant="outline"
                  marginTop="10px"
                  colorScheme="whiteAlpha"
                  _hover={{ backgroundColor: "black", color: "white" }}
                  type="submit"
                  fontWeight="normal"
                >
                  Log In
                </Button>
              </Box>
            </Flex>
            <Flex
              height="20%"
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Text color="white" mb="10px">
                or login with
              </Text>
              <Box>
                <Button
                  variant="outline"
                  fontWeight="normal"
                  colorScheme="whiteAlpha"
                  _hover={{ backgroundColor: "black", color: "white" }}
                  onClick={() => loginWithGithub()}
                >
                  <i className="fab fa-github"></i>&nbsp;Github
                </Button>
              </Box>
            </Flex>
          </Flex>
        </form>
      )}
    </Flex>
  );
};

export default Login;
