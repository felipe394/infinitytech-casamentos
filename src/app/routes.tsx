import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { OurStory } from "./pages/OurStory";
import { Event } from "./pages/Event";
import { GiftList } from "./pages/GiftList";
import { RSVP } from "./pages/RSVP";
import { Gallery } from "./pages/Gallery";
import { Login } from "./pages/Login";
import { Admin } from "./pages/Admin";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "nossa-historia", Component: OurStory },
      { path: "evento", Component: Event },
      { path: "lista-presentes", Component: GiftList },
      { path: "confirmar-presenca", Component: RSVP },
      { path: "galeria", Component: Gallery },
      { path: "login", Component: Login },
      { path: "admin", Component: Admin },
      { path: "*", Component: NotFound },
    ],
  },
]);
