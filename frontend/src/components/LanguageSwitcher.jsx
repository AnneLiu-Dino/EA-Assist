import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { useTranslation } from 'react-i18next';
import ToastNotification from './ToastNotification';
import languages from '../locales/languages.json';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation('langSwitcher');
  const toastRef = useRef(null);
  const langMenu = useRef(null);

  const menuItems = languages.map(lang => ({
    label: lang.name,
    icon: 'pi pi-language',
    command: () => changeLanguage(lang.code, lang.name)
  }));

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode).then((r) => {
      const toastMessage = t('toast_language_changed');
      const toastMessageSummary = t('toast_language_changed_summary');
      toastRef.current.show('success', toastMessageSummary, toastMessage);
    });
  };

  return (
    <div className="card flex justify-content-center">
      <ToastNotification ref={toastRef}/>
      <TieredMenu model={menuItems} popup ref={langMenu} breakpoint="767px"/>
      <Button label="" icon="pi pi-globe" className="p-button-rounded p-button-icon-only"
              onClick={(event) => langMenu.current.toggle(event)}/>
    </div>
  );
};

export default LanguageSwitcher;
