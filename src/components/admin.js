import { supabase } from "../configs/configurations";
import useAdmin from "../hooks/adminhooks";
import {
  Tabs,
  TabList,
  TabPanels,
  Center,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

const Admin = () => {
  let { data, noPost, PostTab, ProfileTab } = useAdmin();

  return supabase.auth.session() == null ? (
    <Center color="white" h="80vh">
      Login in to see your post.
    </Center>
  ) : (
    // <PostTab />
    <Tabs variant="line" size="md" isFitted>
      <TabList color="white">
        <Tab>Manage Posts</Tab>
        <Tab>Manage Profile</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {data == "" ? (
            <Center color="white" h="70vh">
              {noPost}
            </Center>
          ) : (
            <PostTab />
          )}
        </TabPanel>
        <TabPanel>
          <ProfileTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Admin;
