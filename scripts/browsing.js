'use strict';

const compare = (a, b) => a > b ? 1 : a < b ? -1 : 0;

hexo.extend.helper.register('clover_browse_groups', function (kind) {
  if (!['archive', 'category'].includes(kind)) throw new Error(`Unsupported Clover Evo browsing page: ${kind}`);
  const archive = kind === 'archive';
  const posts = archive ? this.page.posts.data : this.site.posts.data;
  const yearly = archive && this.config.archive_generator.yearly !== false;
  const monthly = yearly && this.config.archive_generator.monthly;
  const archiveDir = this.config.archive_dir.replace(/^\/+|\/+$/g, '');
  const uncategorized = Symbol('uncategorized');
  const groups = new Map();
  for (const post of posts) {
    const category = archive ? null : post.categories.data[0];
    const key = archive ? post.date.format('YYYY') : category?.name ?? uncategorized;
    const path = archive ? (yearly ? `${archiveDir}/${key}/` : null) : category?.path;
    if (!groups.has(key)) {
      groups.set(key, {
        title: key === uncategorized ? this.__('other_category') : key,
        order: key === uncategorized ? '__CLOVER_OTHERS' : key,
        path,
        posts: [],
        months: new Map()
      });
    }
    const group = groups.get(key);
    // A shared display name can represent different nested categories.
    if (group.path !== path) group.path = null;
    group.posts.push(post);
    if (monthly) {
      const month = post.date.format('MM');
      if (!group.months.has(month)) {
        group.months.set(month, {
          title: this.date(post.date, 'MMMM'),
          path: `${archiveDir}/${key}/${month}/`,
          posts: []
        });
      }
      group.months.get(month).posts.push(post);
    }
  }
  return [...groups.values()]
    .sort((a, b) => (archive ? -1 : 1) * compare(a.order, b.order))
    .map(group => ({
      title: group.title,
      path: group.path,
      posts: group.posts.sort((a, b) => compare(b.date, a.date)),
      months: [...group.months.entries()]
        .sort(([a], [b]) => compare(b, a))
        .map(([, month]) => ({
          ...month,
          posts: month.posts.sort((a, b) => compare(b.date, a.date))
        }))
    }));
});
