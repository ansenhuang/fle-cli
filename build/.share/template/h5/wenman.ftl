<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title><%= htmlWebpackPlugin.options.title %></title>
  <meta name="keywords" content="<%= htmlWebpackPlugin.options.keywords %>">
  <meta name="description" content="<%= htmlWebpackPlugin.options.description %>">
  <% if (htmlWebpackPlugin.options.icon) { %>
    <link rel="icon" href="<%= htmlWebpackPlugin.options.icon %>">
  <% } %>
  <% for (var i = 0; i < htmlWebpackPlugin.options.css.length; i++) { %>
    <link rel="stylesheet" href="<%= htmlWebpackPlugin.options.css[i] %>">
  <% } %>
  <script type="text/javascript">
    <% if (htmlWebpackPlugin.options.dev) { %>
      <!-- 开发环境mock数据 -->
      window.PG_CONFIG = {
        test: 'This is test data.'
      };
    <% } else { %>
      <!-- 生产环境使用真实数据，注意freemarker语法要包含在此判断中，以免在开发环境中输出而导致报错 -->
      window.PG_CONFIG = {
        test: '${test!}'
      };
    <% } %>

    <% if (htmlWebpackPlugin.options.remUnit != 50) { %>
      window.__DIV_PART__ = 750 / <%= htmlWebpackPlugin.options.remUnit %>;
    <% } %>

    <% if (htmlWebpackPlugin.options.uaId) { %>
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', '<%= htmlWebpackPlugin.options.uaId %>'],['_setLocalGifPath', '/<%= htmlWebpackPlugin.options.uaId %>/__utm.gif'],['_setLocalServerMode']);
      _gaq.push(['_addOrganic','baidu','word']);_gaq.push(['_addOrganic','soso','w']);_gaq.push(['_addOrganic','youdao','q']);
      _gaq.push(['_addOrganic','sogou','query']);_gaq.push(['_addOrganic','so.360.cn','q']);
      _gaq.push(['_trackPageview']);_gaq.push(['trackPageLoadTime']);

      (function() {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = '/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
      })();
    <% } %>
  </script>
  <% for (var j = 0; j < htmlWebpackPlugin.options.prejs.length; j++) { %>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.options.prejs[j] %>"></script>
  <% } %>
</head>
<body>
  <div id="root"></div>
  <% for (var k = 0; k < htmlWebpackPlugin.options.js.length; k++) { %>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.options.js[k] %>"></script>
  <% } %>
</body>
</html>
