import Injector from 'lib/Injector';
import CmsModal from '../components/CmsModal/CmsModal';
import CmsModalContent from '../components/CmsModalContent/CmsModalContent';
import CmsModalBatch from '../components/CmsModalBatch/CmsModalBatch';
import CmsModalSearch from '../components/CmsModalSearch/CmsModalSearch';

export default () => {
  Injector.component.registerMany({
    CmsModal,
    CmsModalContent,
    CmsModalBatch,
    CmsModalSearch,
  });
};
