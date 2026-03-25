/* global window */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';

// Key used to store the React root reference on the portal element
const ROOT_KEY = '__cmsModalRoot';

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

      // Create portal container (once per page)
      let portal = document.getElementById('cms-modal-portal');
      if (!portal) {
        portal = document.createElement('div');
        portal.id = 'cms-modal-portal';
        document.body.appendChild(portal);
      }

      // Unmount any previously mounted modal before rendering a new one
      if (portal[ROOT_KEY]) {
        portal[ROOT_KEY].unmount();
      }

      const root = createRoot(portal);
      portal[ROOT_KEY] = root;

      const triggerEl = this[0];

      const handleClose = () => {
        root.unmount();
        portal[ROOT_KEY] = null;
      };

      const handleSelect = (selectedData) => {
        triggerEl.dispatchEvent(new CustomEvent('cms-modal:select', {
          detail: selectedData,
          bubbles: true,
        }));
        handleClose();
      };

      const CmsModal = loadComponent('CmsModal');
      const ContentComponent = loadComponent(componentName);

      root.render(
        <CmsModal title={title} size={size} onClose={handleClose}>
          <ContentComponent data={modalData} onClose={handleClose} onSelect={handleSelect} />
        </CmsModal>
      );
    },
  });
});
