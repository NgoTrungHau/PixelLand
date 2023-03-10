import routesConfig from '~/config/routes';

// Lauouts
import { HeaderOnly } from '~/Components/Layout';

// Pages
import Home from '~/pages/Home';
import Gallery from '~/pages/Gallery';
import Search from '~/pages/Search';
import Profile from '~/pages/Profile';
import Following from '~/pages/Following';
import MyGallery from '~/pages/MyGallery';

//Public routes
const publicRoutes = [
  { path: routesConfig.home, component: Home },
  { path: routesConfig.gallery, component: Gallery, layout: HeaderOnly },
  { path: routesConfig.search, component: Search },
  { path: routesConfig.profile, component: Profile },
  { path: routesConfig.following, component: Following },
  { path: routesConfig.mygallery, component: MyGallery },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
