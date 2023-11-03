import config from '~/config';

// Layouts
import { HeaderOnly } from '~/layouts';

// Pages
import Home from '~/pages/Home';
import Gallery from '~/pages/Gallery';
import Search from '~/pages/Search';
import Profile from '~/pages/Profile';
import Following from '~/pages/Following';

//Public routes
const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.gallery, component: Gallery, layout: HeaderOnly },
  { path: config.routes.digital, component: Gallery },
  { path: config.routes.search, component: Search },
  { path: config.routes.profile, component: Profile, layout: HeaderOnly },
  { path: config.routes.following, component: Following },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
