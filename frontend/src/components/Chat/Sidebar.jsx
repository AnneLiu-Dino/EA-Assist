import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import { Menu } from 'primereact/menu';
import './css/Sidebar.css';

// Sidebar component to display a list of items with popup menu options
const Sidebar = ({ items, isVisible, handlePopupClick, handleOptionClick, onScroll, toggleSidebar }) => {
  const menuRef = useRef(null); // Reference to the popup menu
  const selectedItemRef = useRef(null); // Reference to the selected item

  // Template for rendering each item in the ListBox
  const itemTemplate = (option) => (
    <div className="listbox-item-template" key={option.id}>
      <span className="item-label">{option.label}</span>
      <Button
        icon="pi pi-ellipsis-h"
        className="p-button-text p-button-plain align-right-button"
        onClick={(e) => handlePopupClick(e, option, menuRef, selectedItemRef)} // Handle popup menu click
      />
    </div>
  );

  return (
    <>
      {/* Overlay to close the sidebar on small screens */}
      {isVisible && window.innerWidth < 600 && <div className="overlay" onClick={toggleSidebar}></div>}
      <aside className={`sidebar ${isVisible ? 'visible' : 'hidden'}`} onScroll={onScroll}>
        <div className="sidebar-header">
          {/* Optional sidebar header content can be added here */}
        </div>
        <div className="sidebar-content">
          <ListBox options={items} itemTemplate={itemTemplate} className="p-mt-3"/> {/* List of items */}
        </div>
        <Menu
          model={[
            { label: 'Edit', command: handleOptionClick }, // Edit option in the popup menu
            {
              label: 'Delete',
              command: () => handleOptionClick(selectedItemRef.current) // Delete option in the popup menu
            }
          ]}
          popup
          ref={menuRef} // Reference to the popup menu
          id="popup_menu"
        />
      </aside>
    </>
  );
};

export default Sidebar;
