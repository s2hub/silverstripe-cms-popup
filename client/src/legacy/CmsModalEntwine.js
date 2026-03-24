/* global window */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';

window.jQuery.entwine('ss', ($) => {
  $('.cms-modal-action').entwine({
    onclick(e) {
      e.preventDefault();
      e.stopPropagation();

      const componentName = this.data('modal-component');
      const title = this.data('modal-title') || '';
      const modalData = this.data('modal-data') || {};
      const size = this.data('modal-size') || 'md';

      if (!componentName) {
        // eslint-disable-next-line no-console
        console.warn('CmsModalAction: no data-modal-component set');
        return;
      }

      // Create portal container
      let portal = document.getElementById('cms-modal-portal');
      if (!portal) {
        portal = document.createElement('div');
        portal.id = 'cms-modal-portal';
        document.body.appendChild(portal);
      }

      const root = createRoot(portal);

      const handleClose = () => {
        root.unmount();
      };

      const CmsModal = loadComponent('CmsModal');
      const ContentComponent = loadComponent(componentName);

      root.render(
        <CmsModal title={title} size={size} onClose={handleClose}>
          <ContentComponent data={modalData} onClose={handleClose} />
        </CmsModal>
      );
    },
  });
});
