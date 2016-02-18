window.onpageshow = function(event) {
  if (event.persisted) {
    return $("#cover").fadeOut(500);
  }
};

window.onload = function() {
  var CSSTransitionGroup, Infos, Modal, Tags, Works, currentScrollTop, easeOption, formatDate, genFlowers, getTumblrPosts, hideModal, iframe, moveToId, openLink, openLinkNewTab, path, path_length, pathj, setBGOpacity, showModal, sidebar, twilink;
  CSSTransitionGroup = React.addons.CSSTransitionGroup;
  if ($(window).width() < 1000) {
    $("#background").css("height", $(window).height() * 1.2 + "px");
  }
  $("#background").hide();
  $("#cover").fadeOut(500, function() {
    return $("#background").fadeIn(500);
  });
  $("#prof-twitter").addClass("ss-link");
  genFlowers = function() {
    var cb, downspeed, flower, img, max_width, n, opacity, results, width;
    n = 0;
    results = [];
    while (n++ < 40) {
      flower = document.createElement("div");
      img = document.createElement("img");
      flower.classList.add("flower");
      img.setAttribute("src", "./resource/hanap.png");
      flower.style.right = Math.random() * 100 + "%";
      max_width = 100;
      width = -1 * Math.log(1 - Math.random()) * 50;
      img.style.width = width + "px";
      downspeed = "downf10";
      if (width > max_width * 0.5) {
        if (width > max_width * 0.8) {
          downspeed = "downf20";
        } else {
          downspeed = "downf15";
        }
      }
      flower.classList.add(downspeed);
      opacity = Math.random();
      img.style.opacity = width > max_width ? 0.1 : opacity;
      flower.appendChild(img);
      cb = function() {
        var deg;
        deg = 0;
        return function() {
          return $(this).css("transform", "rotateY(" + (deg += 120) + "deg)");
        };
      };
      $(img).hover(cb());
      cb = (function(f) {
        return function() {
          return document.getElementById("top-wrapper").appendChild(f);
        };
      })(flower);
      results.push(setTimeout(cb, parseInt(Math.random() * 10000)));
    }
    return results;
  };
  genFlowers();
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
    return function(e) {
      if (e.metaKey) {
        return window.open(link);
      } else {
        return $("#cover").fadeIn(500, function() {
          return window.location.href = link;
        });
      }
    };
  };
  openLinkNewTab = function(link) {
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
      return moveToId();
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
          "onClick": openLink(link),
          "key": tag
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
      var infolink, items, latest, openTumblr;
      items = [];
      if (this.state.posts.length === 0) {
        items.push(React.createElement("div", {
          "className": "loading",
          "key": "loading"
        }, React.createElement("i", {
          "className": "fa fa-2x fa-spinner fa-spin"
        })));
      } else {
        latest = this.state.posts[0];
        openTumblr = openLink(latest.post_url);
        items.push(React.createElement("div", {
          "className": "info-latest",
          "key": "info-latest"
        }, React.createElement("p", {
          "className": "info-latest-title ss-link",
          "onClick": openTumblr
        }, latest.title), React.createElement("div", {
          "className": "info-latest-info clearfix"
        }, React.createElement("span", {
          "className": "info-latest-date left"
        }, formatDate(latest.date)), React.createElement("div", {
          "className": "left"
        }, React.createElement(Tags, {
          "tags": latest.tags
        }))), React.createElement("div", {
          "className": "info-latest-body",
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
          onclick = openLink(post.post_url);
          return React.createElement("li", {
            "className": "info-ele",
            "id": "info-" + i,
            "key": "info-" + i
          }, React.createElement("span", {
            "className": "info-date"
          }, dateString), React.createElement("span", {
            "className": "info-title ss-link",
            "onClick": onclick
          }, title));
        }));
        infolink = "http://side-se.tumblr.com/tagged/info";
        items.push(React.createElement("li", {
          "className": "info-ele",
          "key": "info-old"
        }, React.createElement("span", {
          "className": "info-date hidden"
        }, "2030.10.31"), React.createElement("span", {
          "className": "info-title old-posts ss-link",
          "onClick": openLink(infolink)
        }, "(old posts...)")));
      }
      return React.createElement("div", {
        "className": "infos"
      }, React.createElement(CSSTransitionGroup, {
        "component": "ul",
        "transitionName": "fade",
        "transitionEnterTimeout": 500,
        "transitionLeaveTimeout": 500,
        "className": "infos-ul"
      }, items));
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
      items = [];
      if (this.state.posts.length !== 0) {
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
          onclick = openLink(post.post_url);
          return React.createElement("li", {
            "className": "work ss-link",
            "id": "work-" + i,
            "key": "work-" + i,
            "onClick": onclick
          }, React.createElement("img", {
            "className": "work-image",
            "height": "200px",
            "src": imgSrc
          }), React.createElement("div", {
            "className": "work-title"
          }, title));
        });
      }
      return React.createElement(CSSTransitionGroup, {
        "component": "ul",
        "transitionName": "fade",
        "transitionEnterTimeout": 500,
        "transitionLeaveTimeout": 500,
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
    if (id) {
      to = $(id).offset().top;
    } else {
      id = "#";
      to = 0;
    }
    return $("html, body").animate({
      scrollTop: to
    }, {
      duration: "normal",
      complete: function() {
        return location.href = id;
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
  twilink = "https://twitter.com/seseri7th";
  $("#prof-twitter").click(openLinkNewTab(twilink));
  return setBGOpacity();
};
