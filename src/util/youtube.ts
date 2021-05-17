import { YTMTheme } from '../types';
import { DefaultYTMTheme, MAIN_URL } from '../constants';

export const openTab = () => {
  chrome.tabs.query({ url: MAIN_URL }, tabs => {
    if (tabs && tabs[0]) {
      chrome.tabs.update(tabs[0].id as number, { highlighted: true });
    } else {
      chrome.tabs.create({ url: MAIN_URL });
    }
  });
};

export const createThemeCSS = (theme?: YTMTheme | null) => {
  if (!theme) {
    return '';
  }

  return (`
    /* Nav Bar */
    .center-content.ytmusic-nav-bar {
      background-color: ${theme.headerFooterBackground};
      box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.164)
    }

    /* Scroll Bar */
    .scroller.ytmusic-app::-webkit-scrollbar-track {
      background-color: rgba(230, 230, 230, 0.918);
    }

    .scroller.ytmusic-app::-webkit-scrollbar-thumb {
      background-color: rgb(180, 180, 180);
    }

    /* Search */
    #suggestions {
      background-color: ${theme.headerFooterBackground};
    }

    ytmusic-search-box[has-query] input.ytmusic-search-box, ytmusic-search-box[opened] input.ytmusic-search-box {
      color: ${theme.headerFooterPrimaryText};
    }

    ytmusic-search-suggestion {
      --yt-endpoint-color: ${theme.headerFooterPrimaryText};
      --yt-endpoint-hover-color: ${theme.headerFooterPrimaryText};
      --yt-endpoint-visited-color: ${theme.headerFooterPrimaryText};
      color: ${theme.headerFooterPrimaryText};
      background: transparent;
      --iron-icon-fill-color: ${theme.headerFooterPrimaryText};
    }

    #suggestions.ytmusic-search-suggestions-section > .ytmusic-search-suggestions-section:hover {
      background-color: rgb(195, 195, 195);
    }

    .search-box.ytmusic-search-box {
      background: ${theme.headerFooterBackground};
    }

    /* Bottom Bar */
    ytmusic-player-bar {
      background-color: ${theme.headerFooterBackground};
      box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.164)
    }

    .title.style-scope.ytmusic-player-bar {
      color: ${theme.headerFooterPrimaryText} !important;
    }

    #progress-bar.ytmusic-player-bar {
      --paper-slider-secondary-color: #858585;
    }

    .volume-slider.ytmusic-player-bar {
      --paper-slider-container-color: #c2c2c2;;
      --paper-slider-active-color: #858585;
      --paper-slider-knob-color: #858585;
      --paper-slider-knob-start-color: #858585;;
      --paper-slider-knob-start-border-color: #858585;;
    }

    .repeat.style-scope.ytmusic-player-bar {
      color: #909090;
    }

    .repeat.style-scope.ytmusic-player-bar[title="Repeat all"],
    .repeat.style-scope.ytmusic-player-bar[title="Repeat one"] {
      color: #525252;
    }

    .toggle-player-page-button.ytmusic-player-bar {
      --iron-icon-fill-color: #909090;
    }

    ytmusic-pivot-bar-item-renderer, .search-container.style-scope.ytmusic-search-box {
      color: rgb(117, 117, 117);
    }

    ytmusic-pivot-bar-item-renderer:hover, .search-container.style-scope.ytmusic-search-box:hover {
      color: black;
    }

    ytmusic-pivot-bar-item-renderer[aria-selected="true"] {
      color: black;
    }

    #contents.ytmusic-section-list-renderer {
      background-color: ${theme.mainBackground};
    }

    #nav-bar-background.ytmusic-app-layout::before {
      box-shadow: none;
    }

    .title.text.style-scope.ytmusic-carousel-shelf-basic-header-renderer {
      color: ${theme.mainHeading};
    }

    .scroller.style-scope.ytmusic-app {
      background-color: white;
    }

    /* Music titles */
    .title.style-scope.ytmusic-two-row-item-renderer a,
    .title.style-scope.ytmusic-two-row-item-renderer a:hover,
    .title.style-scope.ytmusic-two-row-item-renderer a:visited,
    .title.ytmusic-two-row-item-renderer {
      color: ${theme.mainPrimary} !important;
    }

    .subtitle.ytmusic-two-row-item-renderer *,
    .subtitle.ytmusic-two-row-item-renderer {
      color: ${theme.mainSecondary} !important;
    }

    .background-gradient.style-scope.ytmusic-immersive-carousel-shelf-renderer .title.text.style-scope.ytmusic-carousel-shelf-basic-header-renderer,
    .background-gradient.style-scope.ytmusic-immersive-carousel-shelf-renderer .title.style-scope.ytmusic-two-row-item-renderer a,
    .background-gradient.style-scope.ytmusic-immersive-carousel-shelf-renderer .title.style-scope.ytmusic-two-row-item-renderer a:hover,
    .background-gradient.style-scope.ytmusic-immersive-carousel-shelf-renderer .title.ytmusic-two-row-item-renderer,
    .background-gradient.style-scope.ytmusic-immersive-carousel-shelf-renderer .title.style-scope.ytmusic-two-row-item-renderer a:visited,{
      color: white;
    }

    #new-recommendations-link {
      color: white;
      background-color: black;
    }

    .content-wrapper.style-scope.ytmusic-play-button-renderer {
      background-color: rgba(0, 0, 0, 0.349);
    }

    .content-wrapper.style-scope.ytmusic-play-button-renderer:hover {
      background-color: rgba(0, 0, 0, 0.521);
    }

    .play-pause-button *, .previous-button *, .next-button * {
      --iron-icon-fill-color: #6d6d6d;
    }

    ytmusic-like-button-renderer[like-status="LIKE"] .like.ytmusic-like-button-renderer,
    ytmusic-like-button-renderer[like-status="DISLIKE"] .dislike.ytmusic-like-button-renderer {
      color: #525252;
    }

    .song-title.style-scope.ytmusic-player-queue-item {
      color: black;
    }

    .scroller.ytmusic-player-page::-webkit-scrollbar-thumb {
      background-color: rgb(201, 201, 201);
    }

    paper-listbox.ytmusic-menu-popup-renderer {
      background-color: #ececec;
      --paper-listbox-background-color: #ececec;
    }

    .icon.ytmusic-toggle-menu-service-item-renderer,
    .icon.ytmusic-menu-navigation-item-renderer,
    .icon.ytmusic-menu-service-item-renderer {
      fill: #757575;
    }

    .text.ytmusic-toggle-menu-service-item-renderer,
    .text.ytmusic-menu-navigation-item-renderer,
    .text.ytmusic-menu-service-item-renderer {
      color: black;
    }

    ytmusic-app-layout {
      --ytmusic-app-layout-nav-bar-background-color: ${theme.mainBackground};
    }

    ytmusic-chip-cloud-chip-renderer:not([style="STYLE_PRIMARY"]):not([style="STYLE_SECONDARY"]) a.ytmusic-chip-cloud-chip-renderer {
      color: #3a3a3a;
    }

    ytmusic-chip-cloud-chip-renderer:not([style="STYLE_PRIMARY"]):not([style="STYLE_SECONDARY"]) a.ytmusic-chip-cloud-chip-renderer:hover {
      background-color: rgb(214, 214, 214);
    }

    .dropdown-trigger.style-scope.ytmusic-menu-renderer iron-icon {
      fill: black;
    }

    /* Album Page */

    .style-scope.ytmusic-entity-browse-page {
      background-color: white;
    }

    .ytmusic-data-bound-album-release-tracks-shelf-renderer .title.ytmusic-list-item-renderer {
      color: black;
    }

    /* General */
    #content.ytmusic-app,
    .ytmusic-browse-response .ytmusic-browse-response {
      background: ${theme.mainBackground} !important;
    }

    .ytmusic-menu-popup-renderer {
      background: ${theme.headerFooterBackground} !important;
    }

    .ytmusic-menu-popup-renderer * {
      fill: ${theme.headerFooterPrimaryText} !important;
      color: ${theme.headerFooterPrimaryText} !important;
    }
    
    /* Header/Footer */
    .ytmusic-player-bar.byline,
    .ytmusic-player-bar.byline * {
      color: ${theme.headerFooterSecondaryText} !important;
    }

    ytmusic-player-bar iron-icon {
      fill: ${theme.headerFooterButtons} !important;
    }

    .ytmusic-nav-bar .ytmusic-pivot-bar-renderer,
    .ytmusic-nav-bar .ytmusic-search-box {
      color: ${theme.headerFooterPrimaryText} !important;
    }

    /* Search Page */
    .ytmusic-search-box.search-icon iron-icon {
      fill: ${theme.headerFooterPrimaryText} !important;
    }

    ytmusic-search-page h2.title,
    ytmusic-search-page h2.title * {
      color: ${theme.mainHeading} !important;
    }

    ytmusic-search-page .ytmusic-shelf-renderer .title,
    ytmusic-search-page .ytmusic-shelf-renderer .title *,
    ytmusic-search-page .ytmusic-tabs,
    ytmusic-search-page .ytmusic-tabs *,
    ytmusic-search-page .ytmusic-chip-cloud-chip-renderer,
    ytmusic-search-page .ytmusic-chip-cloud-chip-renderer * {
      color: ${theme.mainPrimary} !important;
    }

    ytmusic-search-page .secondary-flex-columns,
    ytmusic-search-page .secondary-flex-columns * {
      color: ${theme.mainSecondary} !important;
    }

    ytmusic-search-page ytmusic-tabs.stuck {
      background: ${theme.mainBackground} !important;
    }

    /* Queue/Player Page */
    #player-page {
      background: ${theme.queueBackground} !important;
    }

    #player-page #tabsContainer,
    #player-page #tabsContainer * {
      color: ${theme.queueHeading} !important;
    }

    #player-page ytmusic-player-queue-item .song-title,
    #player-page ytmusic-player-queue-item .song-title * {
      color: ${theme.queuePrimary} !important;
    }

    #player-page ytmusic-player-queue-item .byline,
    #player-page ytmusic-player-queue-item .byline *,
    #player-page ytmusic-player-queue-item .duration,
    #player-page ytmusic-player-queue-item .duration * {
      color: ${theme.queueSecondary} !important;
    }

    #player-page ytmusic-player-queue-item .dropdown-trigger iron-icon {
      fill: ${theme.queueSecondary} !important;
    }

    /* Browse Page */
    #browse-page .ytmusic-detail-header-renderer h2,
    #browse-page .ytmusic-detail-header-renderer h2 * {
      color: ${theme.mainHeading} !important;
    }

    #browse-page .ytmusic-detail-header-renderer .subtitle,
    #browse-page .ytmusic-detail-header-renderer .subtitle *,
    #browse-page .ytmusic-detail-header-renderer .second-subtitle,
    #browse-page .ytmusic-detail-header-renderer .second-subtitle *,
    #browse-page .ytmusic-detail-header-renderer .description,
    #browse-page .ytmusic-detail-header-renderer .description * {
      color: ${theme.mainSecondary} !important;
    }

    #browse-page .ytmusic-responsive-list-item-renderer .title,
    #browse-page .ytmusic-responsive-list-item-renderer .title * {
      color: ${theme.mainPrimary} !important;
    }

    #browse-page .ytmusic-responsive-list-item-renderer.secondary-flex-columns,
    #browse-page .ytmusic-responsive-list-item-renderer.secondary-flex-columns * {
      color: ${theme.mainSecondary} !important;
    }
  `);
}