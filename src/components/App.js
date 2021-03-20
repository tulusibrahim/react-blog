import { useState } from "react";
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


function App() {
  const [data, setData] = useState('')
  const [user, setUser] = useState('')
  const [btnInOut, setBtnInOut] = useState('')

  const getCertainContent = (res) => {
    console.log(res)
    setData(res)
  }

  const getUser = (props) => {
    setUser(props)
  }

  const getBtnInOut = (res) => {
    setBtnInOut(res)
  }

  return (
    <Router>
      <div className="all">
        <Navbar data={btnInOut} />
        <Switch>
          <Route exact path="/" >
            <Search />
            <Content dataFromEmail={user} getdata={getCertainContent} />
          </Route>
          <Route path="/about" component={About}></Route>
          <Route path="/article/:title">
            <Article data={data} />
          </Route>
          <Route path="/login" >
            <Login getuser={getUser} isLogin={getBtnInOut} />
          </Route>
          <Route path="/admin">
            <Admin dataFromEmail={user} />
          </Route>
          <Route path="/new" component={NewBlog}></Route>
          <Route path="/logout">
            <Logout isLogin={getBtnInOut} />
          </Route>
          <Route path="/notresponsive" component={NotResponsive}></Route>
          <Route component={PageNotFound}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
