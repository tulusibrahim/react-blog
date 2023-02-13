import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./home";
import Navbar from "./navbar";
// import Search from "./search";
import About from "./about";
import Article from "./article";
import PageNotFound from "./pageNotFound";
import Login from "./login";
import Admin from "./admin";
import NewBlog from "./newblog";
import Logout from "./logout";
import EditPost from "./editPost";
import { ChakraProvider } from "@chakra-ui/react";
import Topic from "./topics";
import Profile from "./profile";
import Friends from "./friends";

function App() {
  return (
    <ChakraProvider>
      <Router>
        {/* hapus class allwrapper utk toggle color */}
        <div className="allwrapper">
          <div className="all">
            <Navbar />
            <Switch>
              <Route exact path="/">
                {/* <Search /> */}
                <Home />
              </Route>
              <Route path="/about" component={About}></Route>
              <Route path="/article/:title" component={Article}></Route>
              <Route path="/login" component={Login}></Route>
              <Route path="/profile" component={Admin}></Route>
              <Route path="/new" component={NewBlog}></Route>
              <Route path="/edit" component={EditPost}></Route>
              <Route path="/logout" component={Logout}></Route>
              <Route path="/topic/:topic" component={Topic}></Route>
              <Route exact path="/:user/:friends" component={Friends}></Route>
              <Route path="/:user" component={Profile}></Route>
              <Route component={PageNotFound}></Route>
            </Switch>
          </div>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
