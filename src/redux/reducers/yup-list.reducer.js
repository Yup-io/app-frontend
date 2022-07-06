import { yupListConstants as constants } from '../constants';
import produce from 'immer';

const initialState = {
  listOptions: [
    {
      location: { name: '', displayName: '' },
      categories: [{ name: '', displayName: '' }],
      subject: { name: '', displayName: '' },
      times: { name: '', displayName: '' },
      preposition: '',
      tag: '',
      re: '',
      _id: '',
      listType: '',
      listKeyPrefix: '',
      postType: '',
      displayPriority: 0
    }
  ],
  isLoading: true,
  subject: '',
  category: '',
  site: '',
  time: ''
};

export function yupListSettings(state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case constants.SET_LIST_OPTIONS:
        draft['listOptions'] = action.listOptions;
        draft['isLoading'] = false;
        return draft;
    }
  });
}
