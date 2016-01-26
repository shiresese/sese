window.onload = function() {
  var Infos, Modal, Tags, Works, currentScrollTop, easeOption, formatDate, getTumblrPosts, hideModal, iframe, moveToId, openLink, path, path_length, pathj, setBGOpacity, showModal, sidebar;
  $("#cover").fadeOut(500, function() {
    return $("#background").css("opacity", 1);
  });
  getTumblrPosts = function(tag, callback) {
    var api_key, domain, option;
    domain = "side-se.tumblr.com";
    api_key = "1FLh5aV3GU5wC1ofWdUqxhcX5XkNDLjLh66XypGvSvkErzCwhH";
    option = [];
    option.push("tag=" + tag);
    option.push("limit=3");
    option = "&" + option.join("&");
    return $.ajax({
      url: "http://api.tumblr.com/v2/blog/" + domain + "/posts?api_key=" + api_key + option,
      dataType: "jsonp"
    }).done(function(e, e2) {
      return callback(e.response.posts);
    });
  };
  formatDate = function(date, format) {
    var datestr;
    if (typeof date === "string") {
      datestr = date;
      date = new Date(datestr);
      if (isNaN(date)) {
        date = new Date(datestr.slice(0, 10));
      }
    }
    if (format == null) {
      format = 'YYYY.MM.DD';
    }
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    return format;
  };
  openLink = function(link) {
    return function() {
      return window.open(link);
    };
  };
  currentScrollTop = 0;
  showModal = function(post) {
    ReactDOM.render(React.createElement(Modal, {
      "post": post
    }), document.getElementById('modal'));
    currentScrollTop = $(window).scrollTop();
    $("body").addClass("noscroll");
    $("body").css("top", -currentScrollTop);
    return $("#modal-wrapper").fadeIn();
  };
  hideModal = function() {
    $("body").removeClass("noscroll");
    $("body").css("top", "");
    $("html, body").prop({
      scrollTop: currentScrollTop
    });
    return $("#modal-wrapper").fadeOut();
  };
  $(document).keydown(function(e) {
    if (e.keyCode === 27) {
      return hideModal();
    }
  });
  Modal = React.createClass({
    render: function() {
      var openTumblr, title;
      console.log(this.props.post);
      openTumblr = openLink(this.props.post.post_url);
      title = this.props.post.title;
      if (title == null) {
        title = "(名称未設定)";
      }
      return React.createElement("div", {
        "className": "modal-body"
      }, React.createElement("span", {
        "className": "post-date"
      }, formatDate(this.props.post.date)), React.createElement("span", {
        "className": "post-title ss-link",
        "onClick": openTumblr
      }, title), React.createElement(Tags, {
        "tags": this.props.post.tags
      }), React.createElement("div", {
        "className": "post-body",
        "dangerouslySetInnerHTML": {
          __html: this.props.post.body
        }
      }));
    }
  });
  Tags = React.createClass({
    render: function() {
      var items;
      items = this.props.tags.map(function(tag) {
        var link;
        link = "http://side-se.tumblr.com/tagged/" + tag;
        return React.createElement("li", {
          "className": "post-tag ss-link",
          "onClick": openLink(link)
        }, React.createElement("p", null, tag));
      });
      return React.createElement("ul", {
        "className": "post-tag-list"
      }, items);
    }
  });
  Infos = React.createClass({
    getInitialState: function() {
      return {
        posts: []
      };
    },
    componentDidMount: function() {
      return getTumblrPosts("info", (function(_this) {
        return function(posts) {
          return _this.setState({
            "posts": posts
          });
        };
      })(this));
    },
    render: function() {
      var items, latest, openTumblr;
      if (this.state.posts.length === 0) {
        return React.createElement("div", {
          "className": "loading"
        }, React.createElement("i", {
          "className": "fa fa-2x fa-spinner fa-spin"
        }));
      }
      items = [];
      latest = this.state.posts[0];
      openTumblr = openLink(latest.post_url);
      items.push(React.createElement("div", {
        "className": "latest-info"
      }, React.createElement("span", {
        "className": "post-date"
      }, formatDate(latest.date)), React.createElement("span", {
        "className": "post-title ss-link",
        "onClick": openTumblr
      }, latest.title), React.createElement(Tags, {
        "tags": latest.tags
      }), React.createElement("div", {
        "className": "post-body",
        "dangerouslySetInnerHTML": {
          __html: latest.body
        }
      })));
      items.push(this.state.posts.slice(1).map(function(post, i) {
        var dateString, onclick, title;
        title = post.title;
        if (title == null) {
          title = "(名称未設定)";
        }
        dateString = formatDate(post.date, "YYYY.MM.DD");
        onclick = function() {
          return showModal(post);
        };
        return React.createElement("li", {
          "className": "info-ele",
          "id": "info-" + i
        }, React.createElement("span", {
          "className": "info-date"
        }, dateString), React.createElement("span", {
          "className": "info-title ss-link",
          "onClick": onclick
        }, title));
      }));
      return React.createElement("div", {
        "className": "infos"
      }, React.createElement("ul", null, items));
    }
  });
  ReactDOM.render(React.createElement(Infos, null), document.getElementsByClassName('info-inner')[0]);
  Works = React.createClass({
    getInitialState: function() {
      return {
        posts: []
      };
    },
    componentDidMount: function() {
      return getTumblrPosts("work", (function(_this) {
        return function(posts) {
          return _this.setState({
            "posts": posts
          });
        };
      })(this));
    },
    render: function() {
      var items;
      if (this.state.posts.length === 0) {
        return React.createElement("div", {
          "className": "loading"
        }, React.createElement("i", {
          "className": "fa fa-2x fa-spinner fa-spin"
        }));
      }
      items = this.state.posts.map(function(post, i) {
        var imgSrc, onclick, ref, regex, title;
        title = post.title;
        if (title == null) {
          title = "(名称未設定)";
        }
        regex = /<img src="((?:(?!\s).)*)"/;
        imgSrc = (ref = regex.exec(post.body)) != null ? ref[1] : void 0;
        if (imgSrc == null) {
          imgSrc = "./resource/noimage.png";
        }
        onclick = function() {
          return showModal(post);
        };
        return React.createElement("li", {
          "className": "work",
          "id": "work-" + i,
          "onClick": onclick
        }, React.createElement("img", {
          "className": "work-image",
          "height": "200px",
          "src": imgSrc
        }), React.createElement("div", {
          "className": "work-title"
        }, title));
      });
      return React.createElement("ul", {
        "className": "clearfix"
      }, items);
    }
  });
  ReactDOM.render(React.createElement(Works, null), document.getElementsByClassName('work-body')[0]);
  iframe = $('iframe').contents();
  pathj = iframe.find("#down-arrow > path");
  path = pathj.get(0);
  path_length = path.getTotalLength();
  path.style.transition = path.style.WebkitTransition = 'none';
  path.style.strokeDasharray = path_length + ' ' + path_length;
  path.style.strokeDashoffset = path_length;
  pathj.css("display", "inline");
  path.getBoundingClientRect();
  path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
  path.style.strokeDashoffset = '0';
  pathj.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
    return $("#down").addClass("updown");
  });
  setBGOpacity = function() {
    var pos, wHeight;
    if ($("body").hasClass("noscroll")) {
      return;
    }
    wHeight = $(window).height();
    pos = $(window).scrollTop();
    if (+pos < wHeight * 0.5) {
      $(".sidebar").css("opacity", 0);
    } else {
      $(".sidebar").css("opacity", 1);
    }
    return $(".wrapper").css("opacity", pos / wHeight);
  };
  $(window).scroll(setBGOpacity);
  moveToId = function(id) {
    var to;
    to = $(id).offset().top;
    return $("html, body").animate({
      scrollTop: to
    }, {
      duration: "normal",
      complete: function() {
        return location.hash = id;
      }
    });
  };
  sidebar = {
    "Information": "#info",
    "Works": "#works",
    "About": "#about"
  };
  $(".sidebar li").click(function() {
    var id;
    if ($(".sidebar").css("opacity") > 0) {
      console.log($(this).text());
      id = sidebar[$(this).text()];
      return moveToId(id);
    }
  });
  $(".top").click(function() {
    return moveToId("#info");
  });
  easeOption = {
    duration: 500,
    easing: "cubic-bezier(0.465, 0.183, 0.153, 0.946)"
  };
  $("#modal-wrapper").click(function(e) {
    if ($(e.target).hasClass("close")) {
      return hideModal();
    }
  });
  $(".work").click(function(e) {
    e.stopPropagation();
    showModal({});
    return console.log($(this)[0].id);
  });
  return setBGOpacity();
};
