import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Content from "./content";
import Navbar from "./navbar";
import Search from "./search";
import About from "./about";
import Article from "./article";
import PageNotFound from "./pageNotFound";
import Login from "./login";
import Admin from './admin'
import NewBlog from "./newblog";
import Logout from "./logout";
import NotResponsive from "./notResponsive";
import EditPost from "./editPost";
import { ChakraProvider } from "@chakra-ui/react"


function App() {

  return (
    <ChakraProvider>
      <Router>
        <div className="allwrapper">
          <div className="all">
            <Navbar />
            <Switch>
              <Route exact path="/" >
                <Search />
                <Content />
              </Route>
              <Route path="/about" component={About}></Route>
              <Route path="/article/:title" component={Article}></Route>
              <Route path="/login" component={Login}></Route>
              <Route path="/profile" component={Admin}></Route>
              <Route path="/new" component={NewBlog}></Route>
              <Route path="/edit" component={EditPost}></Route>
              <Route path="/logout" component={Logout}></Route>
              <Route path="/notresponsive" component={NotResponsive}></Route>
              <Route component={PageNotFound}></Route>
            </Switch>
          </div>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
