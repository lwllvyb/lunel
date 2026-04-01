import { Search } from 'lucide-react-native';
import { registerPlugin } from '../../registry';
import SearchPanel from './Panel';

registerPlugin({
  id: 'search',
  name: 'Search',
  type: 'extra',
  icon: Search,
  component: SearchPanel,
  defaultTitle: 'Search',
  allowMultipleInstances: true,
});

export { SearchPanel };
