import '../../../styles/cpc_standard.scss';
import {OIL_LABELS} from '../userview_constants';
import {forEach} from '../userview_modal';
import {getBodyFocusClass, getLabel, getLabelWithDefault, getTheme} from '../userview_config';
import {getCustomPurposes, getCustomVendorListUrl} from '../../core/core_config';
import {JS_CLASS_BUTTON_OPTIN, OIL_GLOBAL_OBJECT_NAME} from '../../core/core_constants';
import {setGlobalOilObject} from '../../core/core_utils';
import {getCustomVendorList, getPurposes, getVendorList, getVendorsToDisplay} from '../../core/core_vendor_lists';
import {BackButton, YesButton} from './components/oil.buttons';
import * as ariaUtils from '../aria-utils';


const CLASS_NAME_FOR_ACTIVE_MENU_SECTION = 'as-oil-cpc__category-link--active';

export function oilAdvancedSettingsTemplate() {
  return `
  <div id="as-oil-cpc" class="as-oil-content-overlay" data-qa="oil-cpc-overlay">
    ${oilAdvancedSettingsInlineTemplate()}
  </div>`
}

export function oilAdvancedSettingsInlineTemplate() {
  return `<div class="as-oil-l-wrapper-layout-max-width as-oil-cpc-wrapper">
    <div class="as-oil__heading">
    <h2>
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_HEADING)}
    </h2>
    </div>
    <p class="as-oil__intro-txt">
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_TEXT)}
    </p>
    ${ActivateButtonSnippet()}
    ${BackButton()}
    ${ContentSnippet()}
  </div>`
}

export function focusFirstItemInList(listId) {
  if (listId) {
    let selectedList = document.getElementById(listId);

    if (selectedList && selectedList.firstElementChild) {
      selectedList.firstElementChild.focus();
    }
  }
}

export function attachCpcHandlers() {
  forEach(document.querySelectorAll('.as-js-btn-activate-all'), (domNode) => {
    domNode && domNode.addEventListener('click', activateAll, false);
  });
  forEach(document.querySelectorAll('.as-js-btn-deactivate-all'), (domNode) => {
    domNode && domNode.addEventListener('click', deactivateAll, false);
  });
  attachKeyListNavigationListeners();
}

export function attachKeyListNavigationListeners() {
  forEach(document.querySelectorAll('.as-oil-third-party-list'), (domNode) => {
    ariaUtils.setupKeyBoardTraversableList(domNode, getBodyFocusClass());
  });
}

const ContentSnippet = () => {
  return `
<div data-qa="cpc-snippet" class="as-oil-l-row as-oil-cpc__content">
  <div class="as-oil-cpc__left">
    <a href="#as-oil-cpc-purposes" onclick='${OIL_GLOBAL_OBJECT_NAME}._switchLeftMenuClass(this)' class="as-oil-cpc__category-link ${CLASS_NAME_FOR_ACTIVE_MENU_SECTION}">
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_PURPOSE_DESC)}
    </a>
    <a href="#as-oil-cpc-third-parties" onclick='${OIL_GLOBAL_OBJECT_NAME}._switchLeftMenuClass(this)' class="as-oil-cpc__category-link">
      ${getLabel(OIL_LABELS.ATTR_LABEL_THIRD_PARTY)}
    </a>
    ${IsCustomVendorsEnables() ? `
      <a href="#as-oil-cpc-custom-third-parties" onclick='${OIL_GLOBAL_OBJECT_NAME}._switchLeftMenuClass(this)' class="as-oil-cpc__category-link">
         ${getLabel(OIL_LABELS.ATTR_LABEL_CUSTOM_THIRD_PARTY_HEADING)}
      </a>
    ` : ''}
  </div>
  <div class="as-oil-cpc__middle as-js-purposes">
    <section aria-labelledby="oil-cpc-purpose-title">
      <div class="as-oil-cpc__row-title" id="as-oil-cpc-purposes">
        <h3 id="oil-cpc-purpose-title">
          ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_PURPOSE_DESC)}
        </h3>
      </div>
      ${buildPurposeEntries(getPurposes())}
      ${buildPurposeEntries(getCustomPurposes())}
    </section>
    <section aria-labelledby="oil-cpc-third-party-title">
      <div class="as-oil-cpc__row-title" id="as-oil-cpc-third-parties">
      <h3 id="oil-cpc-third-party-title">
        ${getLabel(OIL_LABELS.ATTR_LABEL_THIRD_PARTY)}
      </h3>
      </div>
      ${buildIabVendorList()}
      ${buildCustomVendorList()}
    </section>
  </div>
  <div class="as-oil-cpc__right">
    <div class="as-oil-l-row as-oil-l-buttons-${getTheme()}">
      <div class="as-oil-l-item">
        ${YesButton(`as-oil__btn-optin ${JS_CLASS_BUTTON_OPTIN}`, `${getLabel(OIL_LABELS.ATTR_LABEL_BUTTON_YES)}, submit my cookie preferences`)}
      </div>
    </div>
  </div>
</div>`;
};

const PurposeContainerSnippet = ({id, header, text, value}) => {
  return `
<div class="as-oil-cpc__purpose">
    <div class="as-oil-cpc__purpose-container">
        <div class="as-oil-cpc__purpose-header" id="as-oil-cpc-${id}-header">${header}</div>
        <div class="as-oil-cpc__purpose-text">${text}</div>
        <label class="as-oil-cpc__switch">
            <span class="off-screen">${header}</span>
            <input data-id="${id}" id="as-js-purpose-slider-${id}" 
            class="as-js-purpose-slider" type="checkbox" name="oil-cpc-purpose-${id}" value="${value}"/>
            <span class="as-oil-cpc__status"></span>
            <span class="as-oil-cpc__slider"></span>
        </label>
    </div>
</div>`
};

const IsCustomVendorsEnables = () => {
  return !!getCustomVendorListUrl();
};

const buildIabVendorList = () => {
  return `
<div id="as-js-third-parties-list">
  ${buildIabVendorEntries()}
</div>`
};

const buildCustomVendorList = () => {
  if (IsCustomVendorsEnables()) {
    return `
<div class="as-oil-cpc__row-title" id="as-oil-cpc-custom-third-parties">
  ${getLabel(OIL_LABELS.ATTR_LABEL_CUSTOM_THIRD_PARTY_HEADING)}
</div>
<div id="as-oil-custom-third-parties-list">
  ${buildCustomVendorEntries()}
</div>`
  } else {
    return '';
  }
};


const buildIabVendorEntries = () => {
  let vendorList = getVendorList();

  if (vendorList && !vendorList.isDefault) {
    let listWrapped = getVendorsToDisplay().map((element) => {
      return buildVendorListEntry(element);
    });
    return `<div class="as-oil-poi-group-list">
              <ul id="third-party-list" class="as-oil-third-party-list" tabindex="-1">
                ${listWrapped.join('')}
              </ul>
            </div>`;
  } else {
    return 'Missing vendor list! Maybe vendor list retrieval has failed! Please contact web administrator!';
  }
};

const buildCustomVendorEntries = () => {
  let customVendorList = getCustomVendorList();

  if (customVendorList && !customVendorList.isDefault) {
    let listWrapped = customVendorList.vendors.map((element) => {
      return buildVendorListEntry(element);
    });
    return `<div class="as-oil-poi-group-list">
              <ul id="custom-third-party-list" class="as-oil-third-party-list" tabindex="-1">
                ${listWrapped.join('')}
              </ul>
            </div>`;
  } else {
    return 'Missing custom vendor list! Maybe vendor list retrieval has failed! Please contact web administrator!';
  }
};

const buildVendorListEntry = (element) => {
  if (element.name) {
    return `
          <li class="as-oil-third-party-list-element" tabindex="-1">
              <button onclick='${OIL_GLOBAL_OBJECT_NAME}._toggleViewElements(this)' aria-expanded="false" tabindex="-1">
                  <svg class='as-oil-icon-plus' width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.675 4.328H10v1.344H5.675V10h-1.35V5.672H0V4.328h4.325V0h1.35z" fill="#0068FF" fill-rule="evenodd" fill-opacity=".88"/>
                  </svg>
                  <svg class='as-oil-icon-minus' style='display: none;' width="10" height="5" viewBox="0 0 10 5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h10v1.5H0z" fill="#3B7BE2" fill-rule="evenodd" opacity=".88"/>
                  </svg>
                  <span class='as-oil-third-party-name'>${element.name}</span>
              </button>
              <div class='as-oil-third-party-toggle-part' style='display: none;'>
                <a class='as-oil-third-party-link' href='${element.policyUrl}'>${element.policyUrl}</a>
              </div>
            </li>
          `;
  }
};

const ActivateButtonSnippet = () => {
  return `
  <div class="as-oil-cpc__row-btn-all">
        <button class="as-js-btn-deactivate-all as-oil__btn-grey" aria-label="Decline all purpose cookies used by this site">${getLabel(OIL_LABELS.ATTR_LABEL_CPC_DEACTIVATE_ALL)}</button>
        <button class="as-js-btn-activate-all as-oil__btn-blue" aria-label="Accept all purpose cookies used by this site">${getLabel(OIL_LABELS.ATTR_LABEL_CPC_ACTIVATE_ALL)}</button>
      </div>
  `
};

const buildPurposeEntries = (list) => {
  return list.map(purpose => PurposeContainerSnippet({
    id: purpose.id,
    header: getLabelWithDefault(`label_cpc_purpose_${formatPurposeId(purpose.id)}_text`, purpose.name || `Error: Missing text for purpose with id ${purpose.id}!`),
    text: getLabelWithDefault(`label_cpc_purpose_${formatPurposeId(purpose.id)}_desc`, purpose.description || ''),
    value: false
  })).join('');
};

const formatPurposeId = (id) => {
  return id < 10 ? `0${id}` : id;
};

function activateAll() {
  let elements = document.querySelectorAll('.as-js-purpose-slider');
  forEach(elements, (domNode) => {
    domNode && (domNode.checked = true);
  });
}

export function deactivateAll() {
  forEach(document.querySelectorAll('.as-js-purpose-slider'), (domNode) => {
    domNode && (domNode.checked = false);
  });
}

function switchLeftMenuClass(element) {
  let allElementsInMenu = element.parentNode.children;

  forEach(allElementsInMenu, (el) => {
    el.className = el.className.replace(new RegExp(`\\s?${CLASS_NAME_FOR_ACTIVE_MENU_SECTION}\\s?`, 'g'), '');
  });
  element.className += ` ${CLASS_NAME_FOR_ACTIVE_MENU_SECTION}`;
}

setGlobalOilObject('_switchLeftMenuClass', switchLeftMenuClass);
setGlobalOilObject('_focusFirstItemInList', focusFirstItemInList);

