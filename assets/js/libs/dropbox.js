(function () {
    var t, e, r, n, o, i, s, a, u, h, l, p, c, d, f, y, v, m, w, g, S, b = {}.hasOwnProperty;
    if (t = function () {
        function t(t) {
            this.client = new e(t)
        }
        return t
    }(), t.ApiError = function () {
        function t(t, e, r) {
            var n;
            if (this.method = e, this.url = r, this.status = t.status, n = t.responseType ? t.response || t.responseText : t.responseText) try {
                this.responseText = "" + n, this.response = JSON.parse(n)
            } catch (o) {
                this.response = null
            } else this.responseText = "(no response)", this.response = null
        }
        return t.prototype.toString = function () {
            return "Dropbox API error " + this.status + " from " + this.method + " " + this.url + " :: " + this.responseText
        }, t.prototype.inspect = function () {
            return "" + this
        }, t
    }(), "undefined" != typeof window && null !== window ? window.atob && window.btoa ? (a = function (t) {
        return window.atob(t)
    }, c = function (t) {
        return window.btoa(t)
    }) : (h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", d = function (t, e, r) {
        var n, o;
        for (o = 3 - e, t <<= 8 * o, n = 3; n >= o;) r.push(h.charAt(63 & t >> 6 * n)), n -= 1;
        for (n = e; 3 > n;) r.push("="), n += 1;
        return null
    }, u = function (t, e, r) {
        var n, o;
        for (o = 4 - e, t <<= 6 * o, n = 2; n >= o;) r.push(String.fromCharCode(255 & t >> 8 * n)), n -= 1;
        return null
    }, c = function (t) {
        var e, r, n, o, i, s;
        for (o = [], e = 0, r = 0, n = i = 0, s = t.length; s >= 0 ? s > i : i > s; n = s >= 0 ? ++i : --i) e = e << 8 | t.charCodeAt(n), r += 1, 3 === r && (d(e, r, o), e = r = 0);
        return r > 0 && d(e, r, o), o.join("")
    }, a = function (t) {
        var e, r, n, o, i, s, a;
        for (i = [], e = 0, n = 0, o = s = 0, a = t.length;
        (a >= 0 ? a > s : s > a) && (r = t.charAt(o), "=" !== r); o = a >= 0 ? ++s : --s) e = e << 6 | h.indexOf(r), n += 1, 4 === n && (u(e, n, i), e = n = 0);
        return n > 0 && u(e, n, i), i.join("")
    }) : (a = function (t) {
        var e, r;
        return e = new Buffer(t, "base64"),
        function () {
            var t, n, o;
            for (o = [], r = t = 0, n = e.length; n >= 0 ? n > t : t > n; r = n >= 0 ? ++t : --t) o.push(String.fromCharCode(e[r]));
            return o
        }().join("")
    }, c = function (t) {
        var e, r;
        return e = new Buffer(function () {
            var e, n, o;
            for (o = [], r = e = 0, n = t.length; n >= 0 ? n > e : e > n; r = n >= 0 ? ++e : --e) o.push(t.charCodeAt(r));
            return o
        }()), e.toString("base64")
    }), t.Client = function () {
        function r(e) {
            this.sandbox = e.sandbox || !1, this.apiServer = e.server || this.defaultApiServer(), this.authServer = e.authServer || this.defaultAuthServer(), this.fileServer = e.fileServer || this.defaultFileServer(), this.downloadServer = e.downloadServer || this.defaultDownloadServer(), this.oauth = new t.Oauth(e), this.driver = null, this.filter = null, this.uid = null, this.authState = null, this.authError = null, this._credentials = null, this.setCredentials(e), this.setupUrls()
        }
        return r.prototype.authDriver = function (t) {
            return this.driver = t, this
        }, r.prototype.xhrFilter = function (t) {
            return this.filter = t, this
        }, r.prototype.dropboxUid = function () {
            return this.uid
        }, r.prototype.credentials = function () {
            return this._credentials || this.computeCredentials(), this._credentials
        }, r.prototype.authenticate = function (r) {
            var n, o, i = this;
            return n = null, o = function () {
                var s;
                if (n !== i.authState && (n = i.authState, i.driver.onAuthStateChange)) return i.driver.onAuthStateChange(i, o);
                switch (i.authState) {
                    case e.RESET:
                        return i.requestToken(function (t, r) {
                            var n, s;
                            return t ? (i.authError = t, i.authState = e.ERROR) : (n = r.oauth_token, s = r.oauth_token_secret, i.oauth.setToken(n, s), i.authState = e.REQUEST), i._credentials = null, o()
                        });
                    case e.REQUEST:
                        return s = i.authorizeUrl(i.oauth.token), i.driver.doAuthorize(s, i.oauth.token, i.oauth.tokenSecret, function () {
                            return i.authState = e.AUTHORIZED, i._credentials = null, o()
                        });
                    case e.AUTHORIZED:
                        return i.getAccessToken(function (t, r) {
                            return t ? (i.authError = t, i.authState = e.ERROR) : (i.oauth.setToken(r.oauth_token, r.oauth_token_secret), i.uid = r.uid, i.authState = e.DONE), i._credentials = null, o()
                        });
                    case e.DONE:
                        return r(null, i);
                    case t.SIGNED_OFF:
                        return i.reset(), o();
                    case e.ERROR:
                        return r(i.authError)
                }
            }, o(), this
        }, r.prototype.signOut = function (r) {
            var n, o = this;
            return n = new t.Xhr("POST", this.urls.signOut), n.addOauthParams(this.oauth), this.dispatchXhr(n, function (t) {
                return t ? r(t) : (o.reset(), o.authState = e.SIGNED_OFF, o.driver.onAuthStateChange ? o.driver.onAuthStateChange(o, function () {
                    return r(t)
                }) : r(t))
            })
        }, r.prototype.signOff = function (t) {
            return this.signOut(t)
        }, r.prototype.getUserInfo = function (e) {
            var r;
            return r = new t.Xhr("GET", this.urls.accountInfo), r.addOauthParams(this.oauth), this.dispatchXhr(r, function (r, n) {
                return e(r, t.UserInfo.parse(n), n)
            })
        }, r.prototype.readFile = function (e, r, n) {
            var o, i, s;
            return n || "function" != typeof r || (n = r, r = null), o = {}, i = null, r && (r.versionTag ? o.rev = r.versionTag : r.rev && (o.rev = r.rev), r.blob && (i = "blob"), r.binary && (i = "b")), s = new t.Xhr("GET", "" + this.urls.getFile + "/" + this.urlEncodePath(e)), s.setParams(o).addOauthParams(this.oauth).setResponseType(i), this.dispatchXhr(s, function (e, r, o) {
                return n(e, r, t.Stat.parse(o))
            })
        }, r.prototype.writeFile = function (e, r, n, o) {
            var i;
            return o || "function" != typeof n || (o = n, n = null), i = t.Xhr.canSendForms && "object" == typeof r, i ? this.writeFileUsingForm(e, r, n, o) : this.writeFileUsingPut(e, r, n, o)
        }, r.prototype.writeFileUsingForm = function (e, r, n, o) {
            var i, s, a, u;
            return a = e.lastIndexOf("/"), -1 === a ? (i = e, e = "") : (i = e.substring(a), e = e.substring(0, a)), s = {
                file: i
            }, n && (n.noOverwrite && (s.overwrite = "false"), n.lastVersionTag ? s.parent_rev = n.lastVersionTag : (n.parentRev || n.parent_rev) && (s.parent_rev = n.parentRev || n.parent_rev)), u = new t.Xhr("POST", "" + this.urls.postFile + "/" + this.urlEncodePath(e)), u.setParams(s).addOauthParams(this.oauth).setFileField("file", i, r, "application/octet-stream"), delete s.file, this.dispatchXhr(u, function (e, r) {
                return o(e, t.Stat.parse(r))
            })
        }, r.prototype.writeFileUsingPut = function (e, r, n, o) {
            var i, s;
            return i = {}, n && (n.noOverwrite && (i.overwrite = "false"), n.lastVersionTag ? i.parent_rev = n.lastVersionTag : (n.parentRev || n.parent_rev) && (i.parent_rev = n.parentRev || n.parent_rev)), s = new t.Xhr("POST", "" + this.urls.putFile + "/" + this.urlEncodePath(e)), s.setBody(r).setParams(i).addOauthParams(this.oauth), this.dispatchXhr(s, function (e, r) {
                return o(e, t.Stat.parse(r))
            })
        }, r.prototype.stat = function (e, r, n) {
            var o, i;
            return n || "function" != typeof r || (n = r, r = null), o = {}, r && (null != r.version && (o.rev = r.version), (r.removed || r.deleted) && (o.include_deleted = "true"), r.readDir && (o.list = "true", r.readDir !== !0 && (o.file_limit = "" + r.readDir)), r.cacheHash && (o.hash = r.cacheHash)), o.include_deleted || (o.include_deleted = "false"), o.list || (o.list = "false"), i = new t.Xhr("GET", "" + this.urls.metadata + "/" + this.urlEncodePath(e)), i.setParams(o).addOauthParams(this.oauth), this.dispatchXhr(i, function (e, r) {
                var o, i, s;
                return s = t.Stat.parse(r), o = (null != r ? r.contents : void 0) ? function () {
                    var e, n, o, s;
                    for (o = r.contents, s = [], e = 0, n = o.length; n > e; e++) i = o[e], s.push(t.Stat.parse(i));
                    return s
                }() : void 0, n(e, s, o)
            })
        }, r.prototype.readdir = function (t, e, r) {
            var n;
            return r || "function" != typeof e || (r = e, e = null), n = {
                readDir: !0
            }, e && (null != e.limit && (n.readDir = e.limit), e.versionTag && (n.versionTag = e.versionTag)), this.stat(t, n, function (t, e, n) {
                var o, i;
                return o = n ? function () {
                    var t, e, r;
                    for (r = [], t = 0, e = n.length; e > t; t++) i = n[t], r.push(i.name);
                    return r
                }() : null, r(t, o, e, n)
            })
        }, r.prototype.metadata = function (t, e, r) {
            return this.stat(t, e, r)
        }, r.prototype.makeUrl = function (e, r, n) {
            var o, i, s, a, u;
            return n || "function" != typeof r || (n = r, r = null), i = r && (r["long"] || r.longUrl || r.downloadHack) ? {
                short_url: "false"
            } : {}, e = this.urlEncodePath(e), s = "" + this.urls.shares + "/" + e, o = !1, a = !1, r && (r.downloadHack ? (o = !0, a = !0) : r.download && (o = !0, s = "" + this.urls.media + "/" + e)), u = new t.Xhr("POST", s).setParams(i).addOauthParams(this.oauth), this.dispatchXhr(u, function (e, r) {
                return a && r && r.url && (r.url = r.url.replace(this.authServer, this.downloadServer)), n(e, t.PublicUrl.parse(r, o))
            })
        }, r.prototype.history = function (e, r, n) {
            var o, i;
            return n || "function" != typeof r || (n = r, r = null), o = {}, r && null != r.limit && (o.rev_limit = r.limit), i = new t.Xhr("GET", "" + this.urls.revisions + "/" + this.urlEncodePath(e)), i.setParams(o).addOauthParams(this.oauth), this.dispatchXhr(i, function (e, r) {
                var o, i;
                return i = r ? function () {
                    var e, n, i;
                    for (i = [], e = 0, n = r.length; n > e; e++) o = r[e], i.push(t.Stat.parse(o));
                    return i
                }() : void 0, n(e, i)
            })
        }, r.prototype.revisions = function (t, e, r) {
            return this.history(t, e, r)
        }, r.prototype.thumbnailUrl = function (t, e) {
            var r;
            return r = this.thumbnailXhr(t, e), r.paramsToUrl().url
        }, r.prototype.readThumbnail = function (e, r, n) {
            var o, i;
            return n || "function" != typeof r || (n = r, r = null), o = "b", r && r.blob && (o = "blob"), i = this.thumbnailXhr(e, r), i.setResponseType(o), this.dispatchXhr(i, function (e, r, o) {
                return n(e, r, t.Stat.parse(o))
            })
        }, r.prototype.thumbnailXhr = function (e, r) {
            var n, o;
            return n = {}, r && (r.format ? n.format = r.format : r.png && (n.format = "png"), r.size && (n.size = r.size)), o = new t.Xhr("GET", "" + this.urls.thumbnails + "/" + this.urlEncodePath(e)), o.setParams(n).addOauthParams(this.oauth)
        }, r.prototype.revertFile = function (e, r, n) {
            var o;
            return o = new t.Xhr("POST", "" + this.urls.restore + "/" + this.urlEncodePath(e)), o.setParams({
                rev: r
            }).addOauthParams(this.oauth), this.dispatchXhr(o, function (e, r) {
                return n(e, t.Stat.parse(r))
            })
        }, r.prototype.restore = function (t, e, r) {
            return this.revertFile(t, e, r)
        }, r.prototype.findByName = function (e, r, n, o) {
            var i, s;
            return o || "function" != typeof n || (o = n, n = null), i = {
                query: r
            }, n && (null != n.limit && (i.file_limit = n.limit), (n.removed || n.deleted) && (i.include_deleted = !0)), s = new t.Xhr("GET", "" + this.urls.search + "/" + this.urlEncodePath(e)), s.setParams(i).addOauthParams(this.oauth), this.dispatchXhr(s, function (e, r) {
                var n, i;
                return i = r ? function () {
                    var e, o, i;
                    for (i = [], e = 0, o = r.length; o > e; e++) n = r[e], i.push(t.Stat.parse(n));
                    return i
                }() : void 0, o(e, i)
            })
        }, r.prototype.search = function (t, e, r, n) {
            return this.findByName(t, e, r, n)
        }, r.prototype.makeCopyReference = function (e, r) {
            var n;
            return n = new t.Xhr("GET", "" + this.urls.copyRef + "/" + this.urlEncodePath(e)), n.addOauthParams(this.oauth), this.dispatchXhr(n, function (e, n) {
                return r(e, t.CopyReference.parse(n))
            })
        }, r.prototype.copyRef = function (t, e) {
            return this.makeCopyReference(t, e)
        }, r.prototype.pullChanges = function (e, r) {
            var n, o;
            return r || "function" != typeof e || (r = e, e = null), n = e ? e.cursorTag ? {
                cursor: e.cursorTag
            } : {
                cursor: e
            } : {}, o = new t.Xhr("POST", this.urls.delta), o.setParams(n).addOauthParams(this.oauth), this.dispatchXhr(o, function (e, n) {
                return r(e, t.PulledChanges.parse(n))
            })
        }, r.prototype.delta = function (t, e) {
            return this.pullChanges(t, e)
        }, r.prototype.mkdir = function (e, r) {
            var n;
            return n = new t.Xhr("POST", this.urls.fileopsCreateFolder), n.setParams({
                root: this.fileRoot,
                path: this.normalizePath(e)
            }).addOauthParams(this.oauth), this.dispatchXhr(n, function (e, n) {
                return r(e, t.Stat.parse(n))
            })
        }, r.prototype.remove = function (e, r) {
            var n;
            return n = new t.Xhr("POST", this.urls.fileopsDelete), n.setParams({
                root: this.fileRoot,
                path: this.normalizePath(e)
            }).addOauthParams(this.oauth), this.dispatchXhr(n, function (e, n) {
                return r(e, t.Stat.parse(n))
            })
        }, r.prototype.unlink = function (t, e) {
            return this.remove(t, e)
        }, r.prototype["delete"] = function (t, e) {
            return this.remove(t, e)
        }, r.prototype.copy = function (e, r, n) {
            var o, i, s;
            return n || "function" != typeof o || (n = o, o = null), i = {
                root: this.fileRoot,
                to_path: this.normalizePath(r)
            }, e instanceof t.CopyReference ? i.from_copy_ref = e.tag : i.from_path = this.normalizePath(e), s = new t.Xhr("POST", this.urls.fileopsCopy), s.setParams(i).addOauthParams(this.oauth), this.dispatchXhr(s, function (e, r) {
                return n(e, t.Stat.parse(r))
            })
        }, r.prototype.move = function (e, r, n) {
            var o, i;
            return n || "function" != typeof o || (n = o, o = null), i = new t.Xhr("POST", this.urls.fileopsMove), i.setParams({
                root: this.fileRoot,
                from_path: this.normalizePath(e),
                to_path: this.normalizePath(r)
            }).addOauthParams(this.oauth), this.dispatchXhr(i, function (e, r) {
                return n(e, t.Stat.parse(r))
            })
        }, r.prototype.reset = function () {
            return this.uid = null, this.oauth.setToken(null, ""), this.authState = e.RESET, this.authError = null, this._credentials = null, this
        }, r.prototype.setCredentials = function (t) {
            return this.oauth.reset(t), this.uid = t.uid || null, this.authState = t.authState ? t.authState : t.token ? e.DONE : e.RESET, this.authError = null, this._credentials = null, this
        }, r.prototype.appHash = function () {
            return this.oauth.appHash()
        }, r.prototype.setupUrls = function () {
            return this.fileRoot = this.sandbox ? "sandbox" : "dropbox", this.urls = {
                requestToken: "" + this.apiServer + "/1/oauth/request_token",
                authorize: "" + this.authServer + "/1/oauth/authorize",
                accessToken: "" + this.apiServer + "/1/oauth/access_token",
                signOut: "" + this.apiServer + "/1/unlink_access_token",
                accountInfo: "" + this.apiServer + "/1/account/info",
                getFile: "" + this.fileServer + "/1/files/" + this.fileRoot,
                postFile: "" + this.fileServer + "/1/files/" + this.fileRoot,
                putFile: "" + this.fileServer + "/1/files_put/" + this.fileRoot,
                metadata: "" + this.apiServer + "/1/metadata/" + this.fileRoot,
                delta: "" + this.apiServer + "/1/delta",
                revisions: "" + this.apiServer + "/1/revisions/" + this.fileRoot,
                restore: "" + this.apiServer + "/1/restore/" + this.fileRoot,
                search: "" + this.apiServer + "/1/search/" + this.fileRoot,
                shares: "" + this.apiServer + "/1/shares/" + this.fileRoot,
                media: "" + this.apiServer + "/1/media/" + this.fileRoot,
                copyRef: "" + this.apiServer + "/1/copy_ref/" + this.fileRoot,
                thumbnails: "" + this.fileServer + "/1/thumbnails/" + this.fileRoot,
                fileopsCopy: "" + this.apiServer + "/1/fileops/copy",
                fileopsCreateFolder: "" + this.apiServer + "/1/fileops/create_folder",
                fileopsDelete: "" + this.apiServer + "/1/fileops/delete",
                fileopsMove: "" + this.apiServer + "/1/fileops/move"
            }
        }, r.ERROR = 0, r.RESET = 1, r.REQUEST = 2, r.AUTHORIZED = 3, r.DONE = 4, r.SIGNED_OFF = 5, r.prototype.urlEncodePath = function (e) {
            return t.Xhr.urlEncodeValue(this.normalizePath(e)).replace(/%2F/gi, "/")
        }, r.prototype.normalizePath = function (t) {
            var e;
            if ("/" === t.substring(0, 1)) {
                for (e = 1;
                "/" === t.substring(e, e + 1);) e += 1;
                return t.substring(e)
            }
            return t
        }, r.prototype.requestToken = function (e) {
            var r;
            return r = new t.Xhr("POST", this.urls.requestToken).addOauthParams(this.oauth), this.dispatchXhr(r, e)
        }, r.prototype.authorizeUrl = function (e) {
            var r;
            return r = {
                oauth_token: e,
                oauth_callback: this.driver.url()
            }, "" + this.urls.authorize + "?" + t.Xhr.urlEncode(r)
        }, r.prototype.getAccessToken = function (e) {
            var r;
            return r = new t.Xhr("POST", this.urls.accessToken).addOauthParams(this.oauth), this.dispatchXhr(r, e)
        }, r.prototype.dispatchXhr = function (t, e) {
            var r;
            return t.setCallback(e), t.prepare(), r = t.xhr, this.filter && !this.filter(r, t) ? r : (t.send(), r)
        }, r.prototype.defaultApiServer = function () {
            return "https://api.dropbox.com"
        }, r.prototype.defaultAuthServer = function () {
            return this.apiServer.replace("api.", "www.")
        }, r.prototype.defaultFileServer = function () {
            return this.apiServer.replace("api.", "api-content.")
        }, r.prototype.defaultDownloadServer = function () {
            return this.apiServer.replace("api.", "dl.")
        }, r.prototype.computeCredentials = function () {
            var t;
            return t = {
                key: this.oauth.key,
                sandbox: this.sandbox
            }, this.oauth.secret && (t.secret = this.oauth.secret), this.oauth.token && (t.token = this.oauth.token, t.tokenSecret = this.oauth.tokenSecret), this.uid && (t.uid = this.uid), this.authState !== e.ERROR && this.authState !== e.RESET && this.authState !== e.DONE && this.authState !== e.SIGNED_OFF && (t.authState = this.authState), this.apiServer !== this.defaultApiServer() && (t.server = this.apiServer), this.authServer !== this.defaultAuthServer() && (t.authServer = this.authServer), this.fileServer !== this.defaultFileServer() && (t.fileServer = this.fileServer), this.downloadServer !== this.defaultDownloadServer() && (t.downloadServer = this.downloadServer), this._credentials = t
        }, r
    }(), e = t.Client, t.AuthDriver = function () {
        function t() {}
        return t.prototype.url = function () {
            return "https://some.url"
        }, t.prototype.doAuthorize = function (t, e, r, n) {
            return n("oauth-token")
        }, t.prototype.onAuthStateChange = function (t, e) {
            return e()
        }, t
    }(), t.Drivers = {}, t.Drivers.Redirect = function () {
        function r(t) {
            this.rememberUser = (null != t ? t.rememberUser : void 0) || !1, this.scope = (null != t ? t.scope : void 0) || "default", this.useQuery = (null != t ? t.useQuery : void 0) || !1, this.receiverUrl = this.computeUrl(t), this.tokenRe = RegExp("(#|\\?|&)oauth_token=([^&#]+)(&|#|$)")
        }
        return r.prototype.url = function () {
            return this.receiverUrl
        }, r.prototype.doAuthorize = function (t) {
            return window.location.assign(t)
        }, r.prototype.onAuthStateChange = function (t, r) {
            var n, o = this;
            switch (this.storageKey = "dropbox-auth:" + this.scope + ":" + t.appHash(), t.authState) {
                case e.RESET:
                    return (n = this.loadCredentials()) ? n.authState ? (n.token === this.locationToken() && (n.authState === e.REQUEST && (this.forgetCredentials(), n.authState = e.AUTHORIZED), t.setCredentials(n)), r()) : this.rememberUser ? (t.setCredentials(n), t.getUserInfo(function (e) {
                        return e && (t.reset(), o.forgetCredentials()), r()
                    })) : (this.forgetCredentials(), r()) : r();
                case e.REQUEST:
                    return this.storeCredentials(t.credentials()), r();
                case e.DONE:
                    return this.rememberUser && this.storeCredentials(t.credentials()), r();
                case e.SIGNED_OFF:
                    return this.forgetCredentials(), r();
                case e.ERROR:
                    return this.forgetCredentials(), r();
                default:
                    return r()
            }
        }, r.prototype.computeUrl = function () {
            var e, r, n, o;
            return o = "_dropboxjs_scope=" + encodeURIComponent(this.scope), r = t.Drivers.Redirect.currentLocation(), -1 === r.indexOf("#") ? e = null : (n = r.split("#", 2), r = n[0], e = n[1]), this.useQuery ? r += -1 === r.indexOf("?") ? "?" + o : "&" + o : e = "?" + o, e ? r + "#" + e : r
        }, r.prototype.locationToken = function () {
            var e, r, n;
            return e = t.Drivers.Redirect.currentLocation(), n = "_dropboxjs_scope=" + encodeURIComponent(this.scope) + "&", -1 === ("function" == typeof e.indexOf ? e.indexOf(n) : void 0) ? null : (r = this.tokenRe.exec(e), r ? decodeURIComponent(r[2]) : null)
        }, r.currentLocation = function () {
            return window.location.href
        }, r.prototype.storeCredentials = function (t) {
            return localStorage.setItem(this.storageKey, JSON.stringify(t))
        }, r.prototype.loadCredentials = function () {
            var t;
            if (t = localStorage.getItem(this.storageKey), !t) return null;
            try {
                return JSON.parse(t)
            } catch (e) {
                return null
            }
        }, r.prototype.forgetCredentials = function () {
            return localStorage.removeItem(this.storageKey)
        }, r
    }(), t.Drivers.Popup = function () {
        function e(t) {
            this.receiverUrl = this.computeUrl(t), this.tokenRe = RegExp("(#|\\?|&)oauth_token=([^&#]+)(&|#|$)")
        }
        return e.prototype.doAuthorize = function (t, e, r, n) {
            return this.listenForMessage(e, n), this.openWindow(t)
        }, e.prototype.url = function () {
            return this.receiverUrl
        }, e.prototype.computeUrl = function (e) {
            var r;
            if (e) {
                if (e.receiverUrl) return e.noFragment || -1 !== e.receiverUrl.indexOf("#") ? e.receiverUrl : e.receiverUrl + "#";
                if (e.receiverFile) return r = t.Drivers.Popup.currentLocation().split("/"), r[r.length - 1] = e.receiverFile, e.noFragment ? r.join("/") : r.join("/") + "#"
            }
            return t.Drivers.Popup.currentLocation()
        }, e.currentLocation = function () {
            return window.location.href
        }, e.prototype.openWindow = function (t) {
            return window.open(t, "_dropboxOauthSigninWindow", this.popupWindowSpec(980, 980))
        }, e.prototype.popupWindowSpec = function (t, e) {
            var r, n, o, i, s, a, u, h, l, p;
            return s = null != (u = window.screenX) ? u : window.screenLeft, a = null != (h = window.screenY) ? h : window.screenTop, i = null != (l = window.outerWidth) ? l : document.documentElement.clientWidth, r = null != (p = window.outerHeight) ? p : document.documentElement.clientHeight, n = Math.round(s + (i - t) / 2), o = Math.round(a + (r - e) / 2.5), "width=" + t + ",height=" + e + "," + ("left=" + n + ",top=" + o) + "dialog=yes,dependent=yes,scrollbars=yes,location=yes"
        }, e.prototype.listenForMessage = function (t, e) {
            var r, n;
            return n = this.tokenRe, r = function (o) {
                var i;
                return i = n.exec("" + o.data), i && decodeURIComponent(i[2]) === t ? (window.removeEventListener("message", r), e()) : void 0
            }, window.addEventListener("message", r, !1)
        }, e
    }(), t.Drivers.NodeServer = function () {
        function t(t) {
            this.port = (null != t ? t.port : void 0) || 8912, this.faviconFile = (null != t ? t.favicon : void 0) || null, this.fs = require("fs"), this.http = require("http"), this.open = require("open"), this.callbacks = {}, this.urlRe = RegExp("^/oauth_callback\\?"), this.tokenRe = RegExp("(\\?|&)oauth_token=([^&]+)(&|$)"), this.createApp()
        }
        return t.prototype.url = function () {
            return "http://localhost:" + this.port + "/oauth_callback"
        }, t.prototype.doAuthorize = function (t, e, r, n) {
            return this.callbacks[e] = n, this.openBrowser(t)
        }, t.prototype.openBrowser = function (t) {
            if (!t.match(/^https?:\/\//)) throw Error("Not a http/https URL: " + t);
            return this.open(t)
        }, t.prototype.createApp = function () {
            var t = this;
            return this.app = this.http.createServer(function (e, r) {
                return t.doRequest(e, r)
            }), this.app.listen(this.port)
        }, t.prototype.closeServer = function () {
            return this.app.close()
        }, t.prototype.doRequest = function (t, e) {
            var r, n, o, i = this;
            return this.urlRe.exec(t.url) && (n = this.tokenRe.exec(t.url), n && (o = decodeURIComponent(n[2]), this.callbacks[o] && (this.callbacks[o](), delete this.callbacks[o]))), r = "", t.on("data", function (t) {
                return r += t
            }), t.on("end", function () {
                return i.faviconFile && "/favicon.ico" === t.url ? i.sendFavicon(e) : i.closeBrowser(e)
            })
        }, t.prototype.closeBrowser = function (t) {
            var e;
            return e = '<!doctype html>\n<script type="text/javascript">window.close();</script>\n<p>Please close this window.</p>', t.writeHead(200, {
                "Content-Length": e.length,
                "Content-Type": "text/html"
            }), t.write(e), t.end
        }, t.prototype.sendFavicon = function (t) {
            return this.fs.readFile(this.faviconFile, function (e, r) {
                return t.writeHead(200, {
                    "Content-Length": r.length,
                    "Content-Type": "image/x-icon"
                }), t.write(r), t.end
            })
        }, t
    }(), l = function (t, e) {
        return s(v(g(t), g(e), t.length, e.length))
    }, p = function (t) {
        return s(w(g(t), t.length))
    }, ("undefined" == typeof window || null === window) && (f = require("crypto"), l = function (t, e) {
        var r;
        return r = f.createHmac("sha1", e), r.update(t), r.digest("base64")
    }, p = function (t) {
        var e;
        return e = f.createHash("sha1"), e.update(t), e.digest("base64")
    }), v = function (t, e, r, n) {
        var o, i, s, a;
        return e.length > 16 && (e = w(e, n)), s = function () {
            var t, r;
            for (r = [], i = t = 0; 16 > t; i = ++t) r.push(909522486 ^ e[i]);
            return r
        }(), a = function () {
            var t, r;
            for (r = [], i = t = 0; 16 > t; i = ++t) r.push(1549556828 ^ e[i]);
            return r
        }(), o = w(s.concat(t), 64 + r), w(a.concat(o), 84)
    }, w = function (t, e) {
        var r, n, o, s, a, u, h, l, p, c, d, f, y, v, w, g, S, b;
        for (t[e >> 2] |= 1 << 31 - ((3 & e) << 3), t[(e + 8 >> 6 << 4) + 15] = e << 3, g = Array(80), r = 1732584193, o = -271733879, a = -1732584194, h = 271733878, p = -1009589776, f = 0, w = t.length; w > f;) {
            for (n = r, s = o, u = a, l = h, c = p, y = b = 0; 80 > b; y = ++b) g[y] = 16 > y ? t[f + y] : m(g[y - 3] ^ g[y - 8] ^ g[y - 14] ^ g[y - 16], 1), 20 > y ? (d = o & a | ~o & h, v = 1518500249) : 40 > y ? (d = o ^ a ^ h, v = 1859775393) : 60 > y ? (d = o & a | o & h | a & h, v = -1894007588) : (d = o ^ a ^ h, v = -899497514), S = i(i(m(r, 5), d), i(i(p, g[y]), v)), p = h, h = a, a = m(o, 30), o = r, r = S;
            r = i(r, n), o = i(o, s), a = i(a, u), h = i(h, l), p = i(p, c), f += 16
        }
        return [r, o, a, h, p]
    }, m = function (t, e) {
        return t << e | t >>> 32 - e
    }, i = function (t, e) {
        var r, n;
        return n = (65535 & t) + (65535 & e), r = (t >> 16) + (e >> 16) + (n >> 16), r << 16 | 65535 & n
    }, s = function (t) {
        var e, r, n, o, i;
        for (o = "", e = 0, n = 4 * t.length; n > e;) r = e, i = (255 & t[r >> 2] >> (3 - (3 & r) << 3)) << 16, r += 1, i |= (255 & t[r >> 2] >> (3 - (3 & r) << 3)) << 8, r += 1, i |= 255 & t[r >> 2] >> (3 - (3 & r) << 3), o += S[63 & i >> 18], o += S[63 & i >> 12], e += 1, o += e >= n ? "=" : S[63 & i >> 6], e += 1, o += e >= n ? "=" : S[63 & i], e += 1;
        return o
    }, S = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", g = function (t) {
        var e, r, n, o, i;
        for (e = [], n = 255, r = o = 0, i = t.length; i >= 0 ? i > o : o > i; r = i >= 0 ? ++o : --o) e[r >> 2] |= (t.charCodeAt(r) & n) << (3 - (3 & r) << 3);
        return e
    }, t.Oauth = function () {
        function e(t) {
            this.key = this.k = null, this.secret = this.s = null, this.token = null, this.tokenSecret = null, this._appHash = null, this.reset(t)
        }
        return e.prototype.reset = function (t) {
            var e, r, n, o;
            if (t.secret) this.k = this.key = t.key, this.s = this.secret = t.secret, this._appHash = null;
            else if (t.key) this.key = t.key, this.secret = null, n = a(y(this.key).split("|", 2)[1]), o = n.split("?", 2), e = o[0], r = o[1], this.k = decodeURIComponent(e), this.s = decodeURIComponent(r), this._appHash = null;
            else if (!this.k) throw Error("No API key supplied");
            return t.token ? this.setToken(t.token, t.tokenSecret) : this.setToken(null, "")
        }, e.prototype.setToken = function (e, r) {
            if (e && !r) throw Error("No secret supplied with the user token");
            return this.token = e, this.tokenSecret = r || "", this.hmacKey = t.Xhr.urlEncodeValue(this.s) + "&" + t.Xhr.urlEncodeValue(r), null
        }, e.prototype.authHeader = function (e, r, n) {
            var o, i, s, a, u, h;
            this.addAuthParams(e, r, n), i = [];
            for (s in n) a = n[s], "oauth_" === s.substring(0, 6) && i.push(s);
            for (i.sort(), o = [], u = 0, h = i.length; h > u; u++) s = i[u], o.push(t.Xhr.urlEncodeValue(s) + '="' + t.Xhr.urlEncodeValue(n[s]) + '"'), delete n[s];
            return "OAuth " + o.join(",")
        }, e.prototype.addAuthParams = function (t, e, r) {
            return this.boilerplateParams(r), r.oauth_signature = this.signature(t, e, r), r
        }, e.prototype.boilerplateParams = function (t) {
            return t.oauth_consumer_key = this.k, t.oauth_nonce = this.nonce(), t.oauth_signature_method = "HMAC-SHA1", this.token && (t.oauth_token = this.token), t.oauth_timestamp = Math.floor(Date.now() / 1e3), t.oauth_version = "1.0", t
        }, e.prototype.nonce = function () {
            return Date.now().toString(36) + Math.random().toString(36)
        }, e.prototype.signature = function (e, r, n) {
            var o;
            return o = e.toUpperCase() + "&" + t.Xhr.urlEncodeValue(r) + "&" + t.Xhr.urlEncodeValue(t.Xhr.urlEncode(n)), l(o, this.hmacKey)
        }, e.prototype.appHash = function () {
            return this._appHash ? this._appHash : this._appHash = p(this.k).replace(/\=/g, "")
        }, e
    }(), null == Date.now && (Date.now = function () {
        return (new Date).getTime()
    }), y = function (t, e) {
        var r, n, o, i, s, u, h, l, p, d, f, y;
        for (e ? (e = [encodeURIComponent(t), encodeURIComponent(e)].join("?"), t = function () {
            var e, n, o;
            for (o = [], r = e = 0, n = t.length / 2; n >= 0 ? n > e : e > n; r = n >= 0 ? ++e : --e) o.push(16 * (15 & t.charCodeAt(2 * r)) + (15 & t.charCodeAt(2 * r + 1)));
            return o
        }()) : (d = t.split("|", 2), t = d[0], e = d[1], t = a(t), t = function () {
            var e, n, o;
            for (o = [], r = e = 0, n = t.length; n >= 0 ? n > e : e > n; r = n >= 0 ? ++e : --e) o.push(t.charCodeAt(r));
            return o
        }(), e = a(e)), i = function () {
            for (y = [], l = 0; 256 > l; l++) y.push(l);
            return y
        }.apply(this), u = 0, s = p = 0; 256 > p; s = ++p) u = (u + i[r] + t[s % t.length]) % 256, f = [i[u], i[s]], i[s] = f[0], i[u] = f[1];
        return s = u = 0, o = function () {
            var t, r, o, a;
            for (a = [], h = t = 0, r = e.length; r >= 0 ? r > t : t > r; h = r >= 0 ? ++t : --t) s = (s + 1) % 256, u = (u + i[s]) % 256, o = [i[u], i[s]], i[s] = o[0], i[u] = o[1], n = i[(i[s] + i[u]) % 256], a.push(String.fromCharCode((n ^ e.charCodeAt(h)) % 256));
            return a
        }(), t = function () {
            var e, n, o;
            for (o = [], r = e = 0, n = t.length; n >= 0 ? n > e : e > n; r = n >= 0 ? ++e : --e) o.push(String.fromCharCode(t[r]));
            return o
        }(), [c(t.join("")), c(o.join(""))].join("|")
    }, t.PulledChanges = function () {
        function e(e) {
            var r;
            this.blankSlate = e.reset || !1, this.cursorTag = e.cursor, this.shouldPullAgain = e.has_more, this.shouldBackOff = !this.shouldPullAgain, this.changes = e.cursor && e.cursor.length ? function () {
                var n, o, i, s;
                for (i = e.entries, s = [], n = 0, o = i.length; o > n; n++) r = i[n], s.push(t.PullChange.parse(r));
                return s
            }() : []
        }
        return e.parse = function (e) {
            return e && "object" == typeof e ? new t.PulledChanges(e) : e
        }, e.prototype.blankSlate = void 0, e.prototype.cursorTag = void 0, e.prototype.changes = void 0, e.prototype.shouldPullAgain = void 0, e.prototype.shouldBackOff = void 0, e
    }(), t.PullChange = function () {
        function e(e) {
            this.path = e[0], this.stat = t.Stat.parse(e[1]), this.stat ? this.wasRemoved = !1 : (this.stat = null, this.wasRemoved = !0)
        }
        return e.parse = function (e) {
            return e && "object" == typeof e ? new t.PullChange(e) : e
        }, e.prototype.path = void 0, e.prototype.wasRemoved = void 0, e.prototype.stat = void 0, e
    }(), t.PublicUrl = function () {
        function e(t, e) {
            this.url = t.url, this.expiresAt = new Date(Date.parse(t.expires)), this.isDirect = e === !0 ? !0 : e === !1 ? !1 : 864e5 >= Date.now() - this.expiresAt, this.isPreview = !this.isDirect
        }
        return e.parse = function (e, r) {
            return e && "object" == typeof e ? new t.PublicUrl(e, r) : e
        }, e.prototype.url = void 0, e.prototype.expiresAt = void 0, e.prototype.isDirect = void 0, e.prototype.isPreview = void 0, e
    }(), t.CopyReference = function () {
        function e(t) {
            "object" == typeof t ? (this.tag = t.copy_ref, this.expiresAt = new Date(Date.parse(t.expires))) : (this.tag = t, this.expiresAt = new Date)
        }
        return e.parse = function (e) {
            return !e || "object" != typeof e && "string" != typeof e ? e : new t.CopyReference(e)
        }, e.prototype.tag = void 0, e.prototype.expiresAt = void 0, e
    }(), t.Stat = function () {
        function e(t) {
            var e, r, n, o;
            switch (this.path = t.path, "/" !== this.path.substring(0, 1) && (this.path = "/" + this.path), e = this.path.length - 1, e >= 0 && "/" === this.path.substring(e) && (this.path = this.path.substring(0, e)), r = this.path.lastIndexOf("/"), this.name = this.path.substring(r + 1), this.isFolder = t.is_dir || !1, this.isFile = !this.isFolder, this.isRemoved = t.is_deleted || !1, this.typeIcon = t.icon, this.modifiedAt = (null != (n = t.modified) ? n.length : void 0) ? new Date(Date.parse(t.modified)) : null, this.clientModifiedAt = (null != (o = t.client_mtime) ? o.length : void 0) ? new Date(Date.parse(t.client_mtime)) : null, t.root) {
                case "dropbox":
                    this.inAppFolder = !1;
                    break;
                case "app_folder":
                    this.inAppFolder = !0;
                    break;
                default:
                    this.inAppFolder = null
            }
            this.size = t.bytes || 0, this.humanSize = t.size || "", this.hasThumbnail = t.thumb_exists || !1, this.isFolder ? (this.versionTag = t.hash, this.mimeType = t.mime_type || "inode/directory") : (this.versionTag = t.rev, this.mimeType = t.mime_type || "application/octet-stream")
        }
        return e.parse = function (e) {
            return e && "object" == typeof e ? new t.Stat(e) : e
        }, e.prototype.path = null, e.prototype.name = null, e.prototype.inAppFolder = null, e.prototype.isFolder = null, e.prototype.isFile = null, e.prototype.isRemoved = null, e.prototype.typeIcon = null, e.prototype.versionTag = null, e.prototype.mimeType = null, e.prototype.size = null, e.prototype.humanSize = null, e.prototype.hasThumbnail = null, e.prototype.modifiedAt = null, e.prototype.clientModifiedAt = null, e
    }(), t.UserInfo = function () {
        function e(t) {
            var e;
            this.name = t.display_name, this.email = t.email, this.countryCode = t.country || null, this.uid = "" + t.uid, t.public_app_url ? (this.publicAppUrl = t.public_app_url, e = this.publicAppUrl.length - 1, e >= 0 && "/" === this.publicAppUrl.substring(e) && (this.publicAppUrl = this.publicAppUrl.substring(0, e))) : this.publicAppUrl = null, this.referralUrl = t.referral_link, this.quota = t.quota_info.quota, this.privateBytes = t.quota_info.normal || 0, this.sharedBytes = t.quota_info.shared || 0, this.usedQuota = this.privateBytes + this.sharedBytes
        }
        return e.parse = function (e) {
            return e && "object" == typeof e ? new t.UserInfo(e) : e
        }, e.prototype.name = null, e.prototype.email = null, e.prototype.countryCode = null, e.prototype.uid = null, e.prototype.referralUrl = null, e.prototype.publicAppUrl = null, e.prototype.quota = null, e.prototype.usedQuota = null, e.prototype.privateBytes = null, e.prototype.sharedBytes = null, e
    }(), "undefined" != typeof window && null !== window ? !window.XDomainRequest || "withCredentials" in new XMLHttpRequest ? (o = window.XMLHttpRequest, n = !1, r = -1 === window.navigator.userAgent.indexOf("Firefox")) : (o = window.XDomainRequest, n = !0, r = !1) : (o = require("xmlhttprequest").XMLHttpRequest, n = !1, r = !1), t.Xhr = function () {
        function e(t, e) {
            this.method = t, this.isGet = "GET" === this.method, this.url = e, this.headers = {}, this.params = null, this.body = null, this.signed = !1, this.responseType = null, this.callback = null, this.xhr = null
        }
        return e.Request = o, e.ieMode = n, e.canSendForms = r, e.prototype.setParams = function (t) {
            if (this.signed) throw Error("setParams called after addOauthParams or addOauthHeader");
            if (this.params) throw Error("setParams cannot be called twice");
            return this.params = t, this
        }, e.prototype.setCallback = function (t) {
            return this.callback = t, this
        }, e.prototype.addOauthParams = function (t) {
            if (this.signed) throw Error("Request already has an OAuth signature");
            return this.params || (this.params = {}), t.addAuthParams(this.method, this.url, this.params), this.signed = !0, this
        }, e.prototype.addOauthHeader = function (t) {
            if (this.signed) throw Error("Request already has an OAuth signature");
            return this.params || (this.params = {}), this.headers.Authorization = t.authHeader(this.method, this.url, this.params), this.signed = !0, this
        }, e.prototype.setBody = function (t) {
            if (this.isGet) throw Error("setBody cannot be called on GET requests");
            if (null !== this.body) throw Error("Request already has a body");
            return this.body = t, this
        }, e.prototype.setResponseType = function (t) {
            return this.responseType = t, this
        }, e.prototype.setAuthHeader = function (t) {
            return this.headers.Authorization = t
        }, e.prototype.setFileField = function (t, e, r, n) {
            var o, i;
            if (null !== this.body) throw Error("Request already has a body");
            if (this.isGet) throw Error("paramsToBody cannot be called on GET requests");
            return i = "object" == typeof r && ("undefined" != typeof Blob && null !== Blob && r instanceof Blob || "undefined" != typeof File && null !== File && r instanceof File), i ? (this.body = new FormData, this.body.append(t, r, e)) : (n || (n = "application/octet-stream"), o = this.multipartBoundary(), this.headers["Content-Type"] = "multipart/form-data; boundary=" + o, this.body = ["--", o, "\r\n", 'Content-Disposition: form-data; name="', t, '"; filename="', e, '"\r\n', "Content-Type: ", n, "\r\n", "Content-Transfer-Encoding: binary\r\n\r\n", r, "\r\n", "--", o, "--", "\r\n"].join(""))
        }, e.prototype.multipartBoundary = function () {
            return [Date.now().toString(36), Math.random().toString(36)].join("----")
        }, e.prototype.paramsToUrl = function () {
            var e;
            return this.params && (e = t.Xhr.urlEncode(this.params), 0 !== e.length && (this.url = [this.url, "?", e].join("")), this.params = null), this
        }, e.prototype.paramsToBody = function () {
            if (this.params) {
                if (null !== this.body) throw Error("Request already has a body");
                if (this.isGet) throw Error("paramsToBody cannot be called on GET requests");
                this.headers["Content-Type"] = "application/x-www-form-urlencoded", this.body = t.Xhr.urlEncode(this.params), this.params = null
            }
            return this
        }, e.prototype.prepare = function () {
            var e, r, n, o, i = this;
            if (r = t.Xhr.ieMode, this.isGet || null !== this.body || r ? (this.paramsToUrl(), null !== this.body && "string" == typeof this.body && (this.headers["Content-Type"] = "text/plain; charset=utf8")) : this.paramsToBody(), this.xhr = new t.Xhr.Request, r ? (this.xhr.onload = function () {
                return i.onLoad()
            }, this.xhr.onerror = function () {
                return i.onError()
            }) : this.xhr.onreadystatechange = function () {
                return i.onReadyStateChange()
            }, this.xhr.open(this.method, this.url, !0), !r) {
                o = this.headers;
                for (e in o) b.call(o, e) && (n = o[e], this.xhr.setRequestHeader(e, n))
            }
            return this.responseType && ("b" === this.responseType ? this.xhr.overrideMimeType && this.xhr.overrideMimeType("text/plain; charset=x-user-defined") : this.xhr.responseType = this.responseType), this
        }, e.prototype.send = function (t) {
            return this.callback = t || this.callback, null !== this.body ? this.xhr.send(this.body) : this.xhr.send(), this
        }, e.urlEncode = function (t) {
            var e, r, n;
            e = [];
            for (r in t) n = t[r], e.push(this.urlEncodeValue(r) + "=" + this.urlEncodeValue(n));
            return e.sort().join("&")
        }, e.urlEncodeValue = function (t) {
            return encodeURIComponent("" + t).replace(/\!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A")
        }, e.urlDecode = function (t) {
            var e, r, n, o, i, s;
            for (r = {}, s = t.split("&"), o = 0, i = s.length; i > o; o++) n = s[o], e = n.split("="), r[decodeURIComponent(e[0])] = decodeURIComponent(e[1]);
            return r
        }, e.prototype.onReadyStateChange = function () {
            var e, r, n, o, i, s, a, u, h;
            if (4 !== this.xhr.readyState) return !0;
            if (200 > this.xhr.status || this.xhr.status >= 300) return e = new t.ApiError(this.xhr, this.method, this.url), this.callback(e), !0;
            if (s = this.xhr.getResponseHeader("x-dropbox-metadata"), null != s ? s.length : void 0) try {
                i = JSON.parse(s)
            } catch (l) {
                i = void 0
            } else i = void 0;
            if (this.responseType) {
                if ("b" === this.responseType) {
                    for (n = null != this.xhr.responseText ? this.xhr.responseText : this.xhr.response, r = [], o = u = 0, h = n.length; h >= 0 ? h > u : u > h; o = h >= 0 ? ++u : --u) r.push(String.fromCharCode(255 & n.charCodeAt(o)));
                    a = r.join(""), this.callback(null, a, i)
                } else this.callback(null, this.xhr.response, i);
                return !0
            }
            switch (a = null != this.xhr.responseText ? this.xhr.responseText : this.xhr.response, this.xhr.getResponseHeader("Content-Type")) {
                case "application/x-www-form-urlencoded":
                    this.callback(null, t.Xhr.urlDecode(a), i);
                    break;
                case "application/json":
                case "text/javascript":
                    this.callback(null, JSON.parse(a), i);
                    break;
                default:
                    this.callback(null, a, i)
            }
            return !0
        }, e.prototype.onLoad = function () {
            var e;
            switch (e = this.xhr.responseText, this.xhr.contentType) {
                case "application/x-www-form-urlencoded":
                    this.callback(null, t.Xhr.urlDecode(e), void 0);
                    break;
                case "application/json":
                case "text/javascript":
                    this.callback(null, JSON.parse(e), void 0);
                    break;
                default:
                    this.callback(null, e, void 0)
            }
            return !0
        }, e.prototype.onError = function () {
            var e;
            return e = new t.ApiError(this.xhr, this.method, this.url), this.callback(e), !0
        }, e
    }(), null != ("undefined" != typeof module && null !== module ? module.exports : void 0)) module.exports = t;
    else {
        if ("undefined" == typeof window || null === window) throw Error("This library only supports node.js and modern browsers.");
        window.Dropbox = t
    }
    t.atob = a, t.btoa = c, t.hmac = l, t.sha1 = p, t.encodeKey = y
}).call(this);