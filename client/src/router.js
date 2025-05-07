import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Interests from "./pages/interests";
import PeopleFeed from "./pages/people-feed";
import Favorites from "./pages/favorites";
import Chats from "./pages/chats";
import Profile from "./pages/profile";
import checkAuth from "./guards/auth"
import { useNavigate } from "react-router-dom";
import People from "./pages/people";

const Index = () => {
  if ((checkAuth())) {
    window.location.href = "/peoples"
  }
}

const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/interests",
      element: <Interests />
    },
    {
      path: "/peoples",
      element: <PeopleFeed />
    },
    {
      path: "/favorites",
      element: <Favorites />
    },
    {
      path: "/chats",
      element: <Chats />
    },
    {
      path: "/profile",
      element: <Profile />
    },
    {
        path: "/people/:userId",
        element: <People />
    }
]);

export default router;