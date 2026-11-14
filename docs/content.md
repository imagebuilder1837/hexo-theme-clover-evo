# 内容指南

[返回 README](../README.md) · [配置指南](configuration.md)

这里说明影响内容呈现、署名和订阅结果的约定。Front matter 的通用写法见 [Hexo 文档](https://hexo.io/zh-cn/docs/front-matter)。

## 语言与摘要

在站点 `_config.yml` 显式设置 `language`。单篇内容可用 `lang` 覆盖，未设置时再读取该篇的 `language`，最后回退到站点语言。使用有效语言标签，例如 `zh-CN` 或 `en-GB`；无效的显式声明会导致生成失败。

文章的 `description` 用作搜索、分享、结构化数据与 Atom 摘要，缺少时回退到 `excerpt`；`excerpt` 同时是列表卡片的正文。摘要转为纯文本，内容取自上述字段；省略 `excerpt` 字段时，可用 Hexo 的 `<!-- more -->` 标记生成正文片段。两者都为空时省略文章摘要；其他页面可回退到站点描述。缺少 `description` 时，个性化的卡片文案也会进入分享和订阅输出。

## 署名、来源与修订

文章 `author` 有三种用法：

- 省略：继承站点 `author`。
- 非空字符串：覆盖站点作者。
- 布尔值 `false`：隐藏署名，并从 Atom 中排除。

其他作者声明会导致生成失败。

`source_url` 用来记录内容来源，支持 HTTP(S) 和相对地址；显式填写的无效地址会导致生成失败。页面 canonical 由站点 URL 和页面路径生成，分页路由各自指向自身。

`date` 沿用 Hexo 的默认取值机制；`updated` 省略时表示未记录公开修订。两个字段显式填写但无法解析时，生成失败。

公开修订以 front matter 中显式填写的 `updated` 为准。详情与卡片按站点时区显示 `YYYY-MM-DD`；记录修订后显示“发表日期 → 修订日期”，同日或早于发表日期的有效修订也照常显示。

## 可选 Atom

需要 Atom 时，在站点安装并配置 `hexo-generator-feed`，例如：

```sh
npm install --save hexo-generator-feed
```

站点 `_config.yml` 的配置示例：

```yaml
feed:
  enable: true
  type: atom
  path: atom.xml
  limit: 20
  content: false
```

主题接管插件已注册的 Atom 生成器。草稿和 `author: false` 的文章在应用条数限制之前排除；收录项缺少有效作者或发表日期时生成失败。

暂不发布的文章使用 Hexo 草稿流程或 `published: false`。单独设置 `draft: true` 只让主题从 Atom 排除该文，网页仍受 Hexo 发布规则控制。

Atom 使用文章的语言、作者、摘要和 canonical；省略显式修订时，协议要求的 `updated` 回退到发表日期。

## 图片与封面

用显式 `photos` 指定列表与分享图片。例如文章 front matter：

```yaml
photos:
  - /images/example.jpg
cover: false
```

第一张 `photos` 图片默认也显示在文章详情页标题之前。`cover: false` 只隐藏详情封面。

`photos` 中语法无效的地址会导致生成失败。文章、普通 `page`、`about` 正文和卡片封面的本地图片会在生成时自动补充可读取的尺寸；本地尺寸读取失败时告警并保留图片，远程图片直接使用原地址。已有 HTML 尺寸与加载属性会保留。图片描述由内容作者提供。

正文图片默认使用浏览器原生懒加载；详情封面优先加载。

## 标题层级

文章和普通 `page` 布局已经提供 H1，正文从 H2 开始。`about` 布局只渲染正文，需要正文自行提供一个 H1。

## 高亮与代码复制

主题使用构建时高亮。站点配置示例：

```yaml
highlight:
  enable: true
  line_number: false
  auto_detect: false
  wrap: false
  hljs: true
  strip_indent: false
  tab_replace: ''
prismjs:
  enable: false
```

代码围栏应标明语言；无法识别的语言和未标记语言保留为纯文本。代码块保留原始换行与缩进，长行在块内横向滚动；行内代码允许换行，避免撑出正文。

复制按钮默认关闭，需要时在站点配置启用：

```yaml
theme_config:
  code_copy: true
```

按钮复制的是展示的代码文本。Clipboard API 不可用或访问被拒绝时提示复制失败，仍可手动选择；按钮通过 JavaScript 添加，静态代码始终可读。

修改内容或相关配置后，在桌面与窄屏浏览器检查图片比例、代码可读性、键盘焦点、复制成功与失败、禁用 JavaScript 后的阅读体验。
