// Lauouts
import { HeaderOnly } from '~/Components/Layout';

// Pages
import Home from '~/pages/Home';
import Gallery from '~/pages/Gallery';
import Contact from '~/pages/Contact';
import Search from '~/pages/Search';
import Profile from '~/pages/Profile';
import Following from '~/pages/Following';
import MyGallery from '~/pages/MyGallery';

//Public routes
const publicRoutes = [
  { path: '/', component: Home },
  { path: '/gallery', component: Gallery, layout: HeaderOnly },
  { path: '/search', component: Search },
  { path: '/contact', component: Contact },
  { path: '/profile', component: Profile },
  { path: '/following', component: Following },
  { path: '/mygallery', component: MyGallery },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
