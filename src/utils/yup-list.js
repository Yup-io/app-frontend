export function parseSettings(settings, listOpts) {
  const defaultOpts = listOpts[0];

  const matchingLocOpts = listOpts.filter(
    (opt) =>
      opt.location.name === settings.site ||
      opt.location.displayName === settings.site
  );

  const defaultLocOpts = listOpts.filter(
    (opt) => opt.location.name === defaultOpts.location.name
  );

  const matchingSubjOpts = matchingLocOpts.filter(
    (opt) =>
      opt.subject.name === settings.subject ||
      opt.subject.displayName === settings.subject
  );

  const opts = matchingSubjOpts[0] || matchingLocOpts[0] || defaultOpts;

  const {
    location: site,
    subject,
    categories,
    searchEnabled,
    preposition,
    postType
  } = opts;
  const defaultCat = categories[0];
  const matchingCats = categories.filter(
    (catInfo) =>
      catInfo.name === settings.category ||
      catInfo.displayName === settings.category
  );
  const category = matchingCats[0] || defaultCat;
  const sitesToFilter =
    matchingLocOpts.length > 0 ? matchingLocOpts : defaultLocOpts;

  const siteSubjs = sitesToFilter.map((opt) => opt.subject);
  const subjCats = opts.categories;

  return {
    list: opts._id,
    site,
    category,
    subject,
    siteSubjs,
    subjCats,
    searchEnabled,
    preposition,
    postType
  };
}
