import { yupListConstants as constants } from '../constants';

export function setListOptions(listOptions) {
  return { type: constants.SET_LIST_OPTIONS, listOptions };
}

export function setListSubject(subject) {
  return { type: constants.SET_LIST_SUBJECT, subject };
}

export function setListSite(site) {
  return { type: constants.SET_LIST_SITE, site };
}

export function setListCategory(category) {
  return { type: constants.SET_LIST_CATEGORY, category };
}

export function setListTime(time) {
  return { type: constants.SET_LIST_TIME, time };
}
